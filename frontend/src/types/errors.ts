/**
 * Tipos para manejo de errores de API
 */

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Array<{
        field: string;
        message: string;
      }>;
    };
    status?: number;
  };
  message?: string;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.response?.data?.message || error.message || 'Error desconocido';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Error desconocido';
}

export function getValidationErrors(error: unknown): Array<{ field: string; message: string }> {
  if (isApiError(error) && error.response?.data?.errors) {
    return error.response.data.errors;
  }
  return [];
}
