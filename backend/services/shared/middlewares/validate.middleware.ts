import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { ApiError } from '../utils/api.error';
import constMessages from '../utils/constants';

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(
      validations.map((validation) => {
        return validation.run(req);
      }),
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        ApiError.badRequest(
          constMessages.validationErrors,
          errors.array({ onlyFirstError: true }),
        ),
      );
    }

    next();
  };
};

export default validate;
