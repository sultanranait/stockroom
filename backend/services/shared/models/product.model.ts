import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import sequelize from '../config/database';
import {
  PRODUCT_STATUSES,
  ProductStatus,
} from '../interfaces/product.interface';
import User from './user.model';

class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare sku: string;
  declare description: CreationOptional<string | null>;
  declare price: number;
  declare quantity: CreationOptional<number>;
  declare status: CreationOptional<ProductStatus>;
  declare created_by: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare creator?: NonAttribute<User>;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      // pg returns NUMERIC columns as strings
      get() {
        const value = this.getDataValue('price');
        return value === null ? value : Number(value);
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(...PRODUCT_STATUSES),
      allowNull: false,
      defaultValue: 'active',
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  },
);

export default Product;
