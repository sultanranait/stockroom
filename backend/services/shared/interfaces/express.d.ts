declare namespace Express {
  interface Request {
    user?: import('./user.interface').AuthUser;
  }
}
