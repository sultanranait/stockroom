import { NextFunction, Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import logger from '../config/logger';
import { ApiError } from '../utils/api.error';
import constMessages from '../utils/constants';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(ApiError.notFound(constMessages.routeNotFound));
};

const toApiError = (err: unknown): ApiError => {
  if (ApiError.isApiError(err)) return err;

  // Thrown by express.json() when the body cannot be parsed
  if (err instanceof SyntaxError && 'body' in err) {
    return ApiError.badRequest(constMessages.malformedJson);
  }

  // Backstop for races that slip past the service-level duplicate checks
  if (err instanceof UniqueConstraintError) {
    return ApiError.conflict(constMessages.resourceExists);
  }

  return ApiError.internalServerError(constMessages.somethingWentWrong);
};

// Express treats a middleware as an error handler only when it has 4 arguments
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = toApiError(err);

  if (error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} failed`, {
      error: err instanceof Error ? err.stack : err,
    });
  }

  res.status(error.statusCode).json(error.body);
};
