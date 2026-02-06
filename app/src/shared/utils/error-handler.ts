/**
 * API Error Handler
 * Transforms fetch errors and backend error responses to user-friendly messages
 */

import type { ApiError } from '@/src/shared/types/api.types';

/**
 * Transforms an error to a user-friendly message
 */
export function handleApiError(error: unknown): string {
  // Network/Fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Unable to connect. Please check your internet connection.';
  }

  // Custom API errors
  if (isApiError(error)) {
    return getErrorMessage(error);
  }

  // Generic errors
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown errors
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Type guard to check if error is an API error
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
}

/**
 * Maps backend error messages to user-friendly messages
 */
function getErrorMessage(error: ApiError): string {
  switch (error.status) {
    case 400:
      return error.message || 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid email or password.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'An account with this email already exists.';
    case 422:
      return error.message || 'Invalid input data.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An error occurred. Please try again.';
  }
}