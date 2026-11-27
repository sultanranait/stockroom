import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api.error';
import constMessages from '../utils/constants';
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from '../utils/token';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token: string | undefined = req.cookies?.[ACCESS_TOKEN_COOKIE];

  if (!token) {
    return next(ApiError.unauthorized(constMessages.authRequired));
  }

  try {
    const { id, email, role } = verifyAccessToken(token);
    req.user = { id, email, role };
    next();
  } catch {
    next(ApiError.unauthorized(constMessages.invalidToken));
  }
};
