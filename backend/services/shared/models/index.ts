import sequelize from '../config/database';
import Product from './product.model';
import User from './user.model';

Product.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Product, { foreignKey: 'created_by', as: 'products' });

export { Product, sequelize, User };
