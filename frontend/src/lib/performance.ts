/**
 * Performance Monitoring and Optimization Utilities
 * Enterprise-grade performance tracking and optimization
 */

import React from 'react';
import { logger } from './logger';

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
  type: 'render' | 'api' | 'interaction' | 'navigation';
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    // Observe long tasks (> 50ms)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              logger.warn('Long task detected', {
                name: entry.name,
                duration: `${entry.duration.toFixed(2)}ms`,
                startTime: entry.startTime,
              });
            }
          }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (e) {
        // Long task API not supported
      }

      // Observe layout shifts
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as any;
            if (layoutShift.value > 0.1) {
              logger.warn('Layout shift detected', {
                value: layoutShift.value,
                hadRecentInput: layoutShift.hadRecentInput,
              });
            }
          }
        });

        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('layout-shift', layoutShiftObserver);
      } catch (e) {
        // Layout shift API not supported
      }
    }
  }

  /**
   * Measure component render time
   */
  measureRender(componentName: string, callback: () => void): void {
    const start = performance.now();
    callback();
    const duration = performance.now() - start;

    this.recordMetric({
      name: componentName,
      duration,
      timestamp: Date.now(),
      type: 'render',
    });

    if (duration > 16.67) {
      // Slower than 60fps
      logger.warn(`Slow render: ${componentName}`, {
        duration: `${duration.toFixed(2)}ms`,
        threshold: '16.67ms (60fps)',
      });
    }
  }

  /**
   * Measure async operation
   */
  async measureAsync<T>(
    name: string,
    operation: () => Promise<T>,
    type: PerformanceMetrics['type'] = 'api'
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;

      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        type,
        metadata: { success: true },
      });

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
        type,
        metadata: { success: false, error: (error as Error).message },
      });

      throw error;
    }
  }

  /**
   * Record custom metric
   */
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Performance: ${metric.name}`, {
        duration: `${metric.duration.toFixed(2)}ms`,
        type: metric.type,
      });
    }
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(): Record<string, any> {
    const summary: Record<string, any> = {
      total: this.metrics.length,
      byType: {},
      averages: {},
    };

    // Group by type
    this.metrics.forEach((metric) => {
      if (!summary.byType[metric.type]) {
        summary.byType[metric.type] = [];
      }
      summary.byType[metric.type].push(metric.duration);
    });

    // Calculate averages
    Object.keys(summary.byType).forEach((type) => {
      const durations = summary.byType[type];
      const avg = durations.reduce((a: number, b: number) => a + b, 0) / durations.length;
      summary.averages[type] = `${avg.toFixed(2)}ms`;
    });

    return summary;
  }

  /**
   * Get Web Vitals
   */
  getWebVitals(): void {
    if (typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      logger.info('FCP (First Contentful Paint)', {
        value: `${fcpEntry.startTime.toFixed(2)}ms`,
        rating: fcpEntry.startTime < 1800 ? 'good' : fcpEntry.startTime < 3000 ? 'needs improvement' : 'poor',
      });
    }

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          
          logger.info('LCP (Largest Contentful Paint)', {
            value: `${lastEntry.renderTime || lastEntry.loadTime}ms`,
            rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs improvement' : 'poor',
          });
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Disconnect all observers
   */
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

// ============================================================================
// OPTIMIZATION UTILITIES
// ============================================================================

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load component with loading state
 */
export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const LazyComponent = React.lazy(factory);
  
  // Add preload method
  (LazyComponent as any).preload = factory;
  
  return LazyComponent;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isIntersecting;
}

/**
 * Measure component performance
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  const WrappedComponent = React.memo((props: P) => {
    React.useEffect(() => {
      const start = performance.now();
      return () => {
        const duration = performance.now() - start;
        performanceMonitor.recordMetric({
          name: componentName,
          duration,
          timestamp: Date.now(),
          type: 'render',
        });
      };
    });

    return React.createElement(Component, props);
  });

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return WrappedComponent;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const performanceMonitor = new PerformanceMonitor();

// Initialize Web Vitals tracking
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    performanceMonitor.getWebVitals();
  });
}

export default performanceMonitor;
