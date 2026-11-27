import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthUser } from '../interfaces/user.interface';

export const ACCESS_TOKEN_COOKIE = 'access_token';

export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.isProduction,
  maxAge: config.jwt.expiresIn * 1000,
  path: '/',
};

export const signAccessToken = (user: AuthUser) => {
  return jwt.sign(user, config.jwt.secret, {
    algorithm: 'HS256',
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwt.secret, {
    algorithms: ['HS256'],
  }) as AuthUser;
};
