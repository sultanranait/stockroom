import { User } from '@shared/models';

const userAttributes = { exclude: ['password'] };

const findByEmail = (email: string) => {
  return User.findOne({ where: { email } });
};

const findById = (id: string) => {
  return User.findByPk(id, { attributes: userAttributes });
};

export const authRepo = { findByEmail, findById };
