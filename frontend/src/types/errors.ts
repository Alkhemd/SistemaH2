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
  
  // Manejar errores de Supabase
  if (error && typeof error === 'object') {
    const supabaseError = error as any;
    if (supabaseError.message) {
      return supabaseError.message;
    }
    if (supabaseError.error) {
      return supabaseError.error;
    }
    if (supabaseError.hint) {
      return supabaseError.hint;
    }
  }
  
  return 'Error desconocido';
}

export function getValidationErrors(error: unknown): Array<{ field: string; message: string }> {
  if (isApiError(error) && error.response?.data?.errors) {
    return error.response.data.errors;
  }
  return [];
}
