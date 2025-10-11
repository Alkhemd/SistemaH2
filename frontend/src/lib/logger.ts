/**
 * Enterprise Logger Service
 * Structured logging with multiple levels and external service integration
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private sessionId: string;
  private isDevelopment: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
      stack: error?.stack,
      sessionId: this.sessionId,
      userId: this.getUserId(),
    };
  }

  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem('userId') || undefined;
  }

  private formatConsoleOutput(entry: LogEntry): void {
    const emoji = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
      [LogLevel.FATAL]: '💀',
    };

    const styles = {
      [LogLevel.DEBUG]: 'color: #6B7280',
      [LogLevel.INFO]: 'color: #3B82F6',
      [LogLevel.WARN]: 'color: #F59E0B',
      [LogLevel.ERROR]: 'color: #EF4444',
      [LogLevel.FATAL]: 'color: #DC2626; font-weight: bold',
    };

    console.log(
      `%c${emoji[entry.level]} [${entry.level.toUpperCase()}] ${entry.message}`,
      styles[entry.level]
    );

    if (entry.context && Object.keys(entry.context).length > 0) {
      console.log('Context:', entry.context);
    }

    if (entry.stack) {
      console.log('Stack:', entry.stack);
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // In production, send to logging service (e.g., Sentry, LogRocket, Datadog)
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureMessage(entry.message, { level: entry.level, extra: entry.context });
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    if (this.isDevelopment) {
      this.formatConsoleOutput(entry);
    }
  }

  info(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.formatConsoleOutput(entry);
    this.sendToExternalService(entry);
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.formatConsoleOutput(entry);
    this.sendToExternalService(entry);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.formatConsoleOutput(entry);
    this.sendToExternalService(entry);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.FATAL, message, context, error);
    this.formatConsoleOutput(entry);
    this.sendToExternalService(entry);
  }

  // Performance monitoring
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`⏱️ ${label}`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  // API call logging
  logApiCall(method: string, url: string, duration: number, status: number): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API ${method.toUpperCase()} ${url}`;
    
    const entry = this.createLogEntry(level, message, {
      method,
      url,
      duration: `${duration}ms`,
      status,
    });

    if (this.isDevelopment) {
      this.formatConsoleOutput(entry);
    }
  }
}

export const logger = new Logger();
export default logger;
