import { ApiError } from '@shared/utils/api.error';
import { success } from '@shared/utils/response';
import { signAccessToken } from '@shared/utils/token';
import bcrypt from 'bcryptjs';
import { authRepo } from '../repo/auth.repo';
import constMessages from '../utils/constants';

// Used when the email is unknown so both paths take about the same time
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);

const login = async (email: string, password: string) => {
  const user = await authRepo.findByEmail(email);
  const isValid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);

  if (!user || !isValid) {
    throw ApiError.unauthorized(constMessages.invalidCredentials);
  }

  const { password: _password, ...profile } = user.toJSON();
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    ...success(constMessages.loginSuccess, { user: profile }),
  };
};

const logout = () => {
  return success(constMessages.logoutSuccess, null);
};

const getProfile = async (id: string) => {
  const user = await authRepo.findById(id);

  if (!user) {
    throw ApiError.notFound(constMessages.userNotFound);
  }

  return success(constMessages.profileFetched, { user });
};

export const authService = { login, logout, getProfile };
