import { isAxiosError } from 'axios';
import type { ApiErrorBody } from '@company/shared-types';

export class ApiError extends Error implements ApiErrorBody {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = body.status;
    this.code = body.code;
    this.fieldErrors = body.fieldErrors;
  }
}

/** Converts anything thrown by Axios (or elsewhere) into an `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError<Partial<ApiErrorBody>>(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError({
        status: 408,
        code: 'TIMEOUT',
        message: 'The request timed out. Try again.',
      });
    }
    if (!error.response) {
      return new ApiError({
        status: 0,
        code: 'NETWORK_ERROR',
        message: 'Network error. Check your connection.',
      });
    }
    const { status, data } = error.response;
    return new ApiError({
      status,
      code: data?.code ?? `HTTP_${status}`,
      message: data?.message ?? error.message,
      fieldErrors: data?.fieldErrors,
    });
  }

  return new ApiError({
    status: 500,
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Something went wrong.',
  });
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
