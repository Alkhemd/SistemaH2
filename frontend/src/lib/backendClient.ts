/**
 * Backend API Client
 * HTTP client for calling our Express backend instead of Supabase directly
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

class BackendClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                cache: 'no-store', // Disable both Next.js and browser cache
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    ...options.headers,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                return { data: null, error: result.error || 'Request failed' };
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            return { data: null, error: (error as Error).message };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const backendClient = new BackendClient();
export default backendClient;
