import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Error types
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ErrorContext {
  operation: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
}

// Error classification
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  UNKNOWN = 'unknown'
}

// Error classification function
export const classifyError = (error: FetchBaseQueryError | SerializedError): {
  category: ErrorCategory;
  severity: ErrorSeverity;
  isRetryable: boolean;
} => {
  if ('status' in error) {
    const status = error.status;
    
    if (status === 'FETCH_ERROR') {
      return {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.HIGH,
        isRetryable: true
      };
    }
    
    if (status === 'TIMEOUT_ERROR') {
      return {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        isRetryable: true
      };
    }
    
    if (typeof status === 'number') {
      if (status === 401) {
        return {
          category: ErrorCategory.AUTHENTICATION,
          severity: ErrorSeverity.HIGH,
          isRetryable: false
        };
      }
      
      if (status === 403) {
        return {
          category: ErrorCategory.AUTHORIZATION,
          severity: ErrorSeverity.HIGH,
          isRetryable: false
        };
      }
      
      if (status >= 400 && status < 500) {
        return {
          category: ErrorCategory.VALIDATION,
          severity: ErrorSeverity.MEDIUM,
          isRetryable: false
        };
      }
      
      if (status >= 500) {
        return {
          category: ErrorCategory.SYSTEM,
          severity: ErrorSeverity.CRITICAL,
          isRetryable: true
        };
      }
    }
  }
  
  return {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    isRetryable: false
  };
};

// User-friendly error messages
export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError,
  context?: ErrorContext
): string => {
  const { category } = classifyError(error);
  
  // Try to extract message from error
  let errorMessage = 'An unexpected error occurred';
  
  if ('status' in error) {
    if (error.status === 'FETCH_ERROR') {
      errorMessage = 'Network connection failed. Please check your internet connection.';
    } else if (error.status === 'TIMEOUT_ERROR') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (typeof error.status === 'number') {
      const data = error.data as any;
      
      if (data?.message) {
        errorMessage = data.message;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Authentication required. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = context?.entityType 
              ? `${context.entityType} not found.`
              : 'Resource not found.';
            break;
          case 409:
            errorMessage = 'Conflict detected. The resource may have been modified by another user.';
            break;
          case 422:
            errorMessage = 'Validation failed. Please check your input.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = `Request failed with status ${error.status}.`;
        }
      }
    }
  } else if ('message' in error && error.message) {
    errorMessage = error.message;
  }
  
  // Add context if available
  if (context?.operation) {
    errorMessage = `Failed to ${context.operation}: ${errorMessage}`;
  }
  
  return errorMessage;
};

// Error logging
export const logError = (
  error: FetchBaseQueryError | SerializedError,
  context?: ErrorContext
) => {
  const { category, severity } = classifyError(error);
  const message = getErrorMessage(error, context);
  
  const logData = {
    error,
    context,
    category,
    severity,
    message,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.group(`🚨 API Error [${severity.toUpperCase()}]`);
    console.error('Message:', message);
    console.error('Category:', category);
    console.error('Context:', context);
    console.error('Raw Error:', error);
    console.groupEnd();
  }
  
  // In production, you might want to send to error tracking service
  if (import.meta.env.PROD && severity === ErrorSeverity.CRITICAL) {
    // Send to error tracking service (e.g., Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: logData });
  }
};

// Retry logic helper
export const shouldRetry = (
  error: FetchBaseQueryError | SerializedError,
  attemptCount: number,
  maxAttempts: number = 3
): boolean => {
  if (attemptCount >= maxAttempts) {
    return false;
  }
  
  const { isRetryable } = classifyError(error);
  return isRetryable;
};

// Exponential backoff delay calculation
export const calculateRetryDelay = (attemptCount: number, baseDelay: number = 1000): number => {
  return Math.min(baseDelay * Math.pow(2, attemptCount), 10000); // Max 10 seconds
};

// Error boundary helper for React components
export const handleComponentError = (error: Error, errorInfo: any) => {
  const logData = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    errorInfo,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };
  
  console.error('Component Error:', logData);
  
  // Send to error tracking service in production
  if (import.meta.env.PROD) {
    // Example: Sentry.captureException(error, { extra: logData });
  }
};

// Validation error helpers
export const formatValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';
  
  if (errors.length === 1) {
    return errors[0].message;
  }
  
  return `Multiple validation errors:\n${errors.map(e => `• ${e.message}`).join('\n')}`;
};

export const groupValidationErrorsByField = (errors: ValidationError[]): Record<string, ValidationError[]> => {
  return errors.reduce((acc, error) => {
    if (!acc[error.field]) {
      acc[error.field] = [];
    }
    acc[error.field].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);
};

// Network status helpers
export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const getNetworkStatus = (): {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
} => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    isOnline: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
  };
};

// Error recovery suggestions
export const getRecoverySuggestions = (
  error: FetchBaseQueryError | SerializedError,
  context?: ErrorContext
): string[] => {
  const { category } = classifyError(error);
  const suggestions: string[] = [];
  
  switch (category) {
    case ErrorCategory.NETWORK:
      suggestions.push('Check your internet connection');
      suggestions.push('Try refreshing the page');
      suggestions.push('Wait a moment and try again');
      break;
      
    case ErrorCategory.AUTHENTICATION:
      suggestions.push('Log out and log back in');
      suggestions.push('Clear your browser cache');
      suggestions.push('Contact your administrator if the problem persists');
      break;
      
    case ErrorCategory.AUTHORIZATION:
      suggestions.push('Contact your administrator for access');
      suggestions.push('Verify you have the correct permissions');
      break;
      
    case ErrorCategory.VALIDATION:
      suggestions.push('Check your input data');
      suggestions.push('Ensure all required fields are filled');
      suggestions.push('Verify data formats are correct');
      break;
      
    case ErrorCategory.SYSTEM:
      suggestions.push('Try again in a few minutes');
      suggestions.push('Contact support if the problem persists');
      break;
      
    default:
      suggestions.push('Try refreshing the page');
      suggestions.push('Contact support if the problem continues');
  }
  
  return suggestions;
};
