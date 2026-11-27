import { NextFunction, Request, Response } from 'express';
import { Role } from '../interfaces/user.interface';
import { ApiError } from '../utils/api.error';
import constMessages from '../utils/constants';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(constMessages.forbiddenAction));
    }
    next();
  };
};
