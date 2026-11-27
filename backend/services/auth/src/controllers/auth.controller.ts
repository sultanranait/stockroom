import {
  ACCESS_TOKEN_COOKIE,
  accessTokenCookieOptions,
} from '@shared/utils/token';
import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { authService } from '../services/auth.service';

const login = async (req: Request, res: Response) => {
  const { email, password } = matchedData<{ email: string; password: string }>(
    req,
  );
  const { accessToken, ...result } = await authService.login(email, password);

  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions);
  res.status(result.statusCode).json(result);
};

const logout = (req: Request, res: Response) => {
  const result = authService.logout();

  res.clearCookie(ACCESS_TOKEN_COOKIE, accessTokenCookieOptions);
  res.status(result.statusCode).json(result);
};

const me = async (req: Request, res: Response) => {
  const result = await authService.getProfile(req.user!.id);
  res.status(result.statusCode).json(result);
};

export const authController = { login, logout, me };
