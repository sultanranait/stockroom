import {
  ProductFilters,
  ProductInput,
} from '@shared/interfaces/product.interface';
import { Product, User } from '@shared/models';
import { Op } from 'sequelize';

const creatorInclude = {
  model: User,
  as: 'creator',
  attributes: ['id', 'name'],
};

// Escape LIKE wildcards so a search for "50%" matches literally
const likePattern = (value: string) => {
  return `%${value.replace(/[\\%_]/g, '\\$&')}%`;
};

const findAll = ({
  page,
  limit,
  search,
  status,
}: Required<Pick<ProductFilters, 'page' | 'limit'>> & ProductFilters) => {
  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: likePattern(search) } },
            { sku: { [Op.iLike]: likePattern(search) } },
          ],
        }
      : {}),
  };

  return Product.findAndCountAll({
    where,
    include: [creatorInclude],
    // id breaks ties so pages stay stable when rows share a timestamp
    order: [
      ['created_at', 'DESC'],
      ['id', 'ASC'],
    ],
    limit,
    offset: (page - 1) * limit,
  });
};

const findById = (id: string) => {
  return Product.findByPk(id, { include: [creatorInclude] });
};

const findBySku = (sku: string) => {
  return Product.findOne({ where: { sku } });
};

const create = (data: ProductInput & { created_by: string }) => {
  return Product.create(data);
};

const update = (product: Product, data: Partial<ProductInput>) => {
  return product.update(data);
};

const remove = (id: string) => {
  return Product.destroy({ where: { id } });
};

export const productRepo = {
  findAll,
  findById,
  findBySku,
  create,
  update,
  remove,
};
