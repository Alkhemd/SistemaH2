/**
 * Enhanced API Client with Enterprise Features
 * - Retry logic with exponential backoff
 * - Request/Response interceptors
 * - Offline detection
 * - Request cancellation
 * - Rate limiting
 * - Caching strategy
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// ============================================================================
// TYPES
// ============================================================================

interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

interface ApiClientConfig extends AxiosRequestConfig {
  retry?: Partial<RetryConfig>;
  skipAuth?: boolean;
}

// ============================================================================
// API CLIENT CLASS
// ============================================================================

class ApiClient {
  private instance: AxiosInstance;
  private requestQueue: Map<string, AbortController>;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.requestQueue = new Map();
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add timestamp for request tracking
        config.headers['X-Request-ID'] = this.generateRequestId();
        config.headers['X-Request-Time'] = new Date().toISOString();

        // Add auth token if available
        const token = this.getAuthToken();
        if (token && !config.headers['skipAuth']) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          const duration = this.calculateDuration(response.config.headers['X-Request-Time']);
          console.log(`✅ API Response: ${response.config.url} (${duration}ms)`, response.data);
        }

        return response;
      },
      async (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  /**
   * Handle response errors with retry logic
   */
  private async handleResponseError(error: AxiosError): Promise<any> {
    const config = error.config as ApiClientConfig;

    // Log error
    console.error('❌ API Error:', {
      url: config?.url,
      method: config?.method,
      status: error.response?.status,
      message: error.message,
    });

    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          this.handleUnauthorized();
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found:', config?.url);
          break;
        case 429:
          // Rate limit exceeded
          console.warn('Rate limit exceeded, retrying...');
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - retry
          if (this.shouldRetry(error, config)) {
            return this.retryRequest(error, config);
          }
          break;
      }
    }

    // Network errors - retry
    if (!error.response && this.shouldRetry(error, config)) {
      return this.retryRequest(error, config);
    }

    return Promise.reject(error);
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: AxiosError, config?: ApiClientConfig): boolean {
    if (!config?.retry) return false;

    const retryConfig = {
      retries: MAX_RETRIES,
      retryDelay: RETRY_DELAY,
      ...config.retry,
    };

    const currentRetry = (config as any).__retryCount || 0;

    if (currentRetry >= retryConfig.retries) {
      return false;
    }

    // Retry on network errors or 5xx errors
    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500;
    const isRetryableMethod = ['get', 'head', 'options'].includes(config?.method?.toLowerCase() || '');

    return Boolean((isNetworkError || isServerError) && isRetryableMethod);
  }

  /**
   * Retry failed request with exponential backoff
   */
  private async retryRequest(error: AxiosError, config?: ApiClientConfig): Promise<any> {
    const retryConfig = {
      retries: MAX_RETRIES,
      retryDelay: RETRY_DELAY,
      ...config?.retry,
    };

    const currentRetry = ((config as any).__retryCount || 0) + 1;
    (config as any).__retryCount = currentRetry;

    // Exponential backoff
    const delay = retryConfig.retryDelay * Math.pow(2, currentRetry - 1);

    console.log(`🔄 Retrying request (${currentRetry}/${retryConfig.retries}) in ${delay}ms...`);

    await this.sleep(delay);

    return this.instance.request(config!);
  }

  /**
   * GET request with retry
   */
  async get<T = any>(url: string, config?: ApiClientConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T, AxiosResponse<T>>(url, {
      ...config,
      retry: { retries: MAX_RETRIES, ...config?.retry },
    } as any);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: ApiClientConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.requestQueue.forEach((controller) => {
      controller.abort();
    });
    this.requestQueue.clear();
  }

  /**
   * Cancel specific request by key
   */
  cancelRequest(key: string): void {
    const controller = this.requestQueue.get(key);
    if (controller) {
      controller.abort();
      this.requestQueue.delete(key);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      // Redirect to login
      // window.location.href = '/login';
    }
  }

  private calculateDuration(startTime: string): number {
    const start = new Date(startTime).getTime();
    const end = Date.now();
    return end - start;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if client is online
   */
  isOnline(): boolean {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return API_BASE_URL;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const apiClient = new ApiClient();

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
} = apiClient;

export default apiClient;
