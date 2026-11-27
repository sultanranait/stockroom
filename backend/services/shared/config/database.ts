import { Sequelize } from 'sequelize';
import config from './index';

const sequelize = new Sequelize(config.db.url, {
  dialect: 'postgres',
  dialectOptions: { ssl: config.db.ssl },
  logging: false,
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

export default sequelize;
