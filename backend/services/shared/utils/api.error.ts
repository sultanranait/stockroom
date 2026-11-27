export type ErrorBody = {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
};

export type ApiError = {
  statusCode: number;
  body: ErrorBody;
};

const createApiError = (
  statusCode: number,
  error: string,
  message: string,
  details?: unknown,
): ApiError => {
  return {
    statusCode,
    body: { error, message, statusCode, details },
  };
};

// body-parser errors also carry statusCode and body, so check the body shape
const isApiError = (err: unknown): err is ApiError => {
  if (typeof err !== 'object' || err === null) return false;

  const { statusCode, body } = err as Partial<ApiError>;
  return (
    typeof statusCode === 'number' &&
    typeof body === 'object' &&
    body !== null &&
    typeof body.error === 'string'
  );
};

export const ApiError = {
  badRequest: (message: string, details?: unknown) => {
    return createApiError(400, 'badRequest', message, details);
  },
  unauthorized: (message: string) => {
    return createApiError(401, 'unauthorized', message);
  },
  forbidden: (message: string) => {
    return createApiError(403, 'forbidden', message);
  },
  notFound: (message: string) => {
    return createApiError(404, 'notFound', message);
  },
  conflict: (message: string) => {
    return createApiError(409, 'conflict', message);
  },
  tooManyRequests: (message: string) => {
    return createApiError(429, 'tooManyRequests', message);
  },
  internalServerError: (message: string) => {
    return createApiError(500, 'internalServerError', message);
  },
  isApiError,
};
