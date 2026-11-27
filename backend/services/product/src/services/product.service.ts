import {
  ProductFilters,
  ProductInput,
} from '@shared/interfaces/product.interface';
import { ApiError } from '@shared/utils/api.error';
import { paginated, success } from '@shared/utils/response';
import { productRepo } from '../repo/product.repo';
import constMessages from '../utils/constants';

const getProducts = async (filters: ProductFilters) => {
  const { page = 1, limit = 10, search, status } = filters;
  const { rows, count } = await productRepo.findAll({
    page,
    limit,
    search,
    status,
  });

  return success(
    constMessages.productsFetched,
    paginated(rows, count, page, limit),
  );
};

const getProductById = async (id: string) => {
  const product = await productRepo.findById(id);

  if (!product) {
    throw ApiError.notFound(constMessages.productNotFound);
  }

  return success(constMessages.productFetched, product);
};

const createProduct = async (input: ProductInput, userId: string) => {
  if (await productRepo.findBySku(input.sku)) {
    throw ApiError.conflict(constMessages.skuExists);
  }

  const product = await productRepo.create({ ...input, created_by: userId });
  return success(constMessages.productCreated, product, 201);
};

const updateProduct = async (id: string, input: Partial<ProductInput>) => {
  const product = await productRepo.findById(id);

  if (!product) {
    throw ApiError.notFound(constMessages.productNotFound);
  }

  if (
    input.sku &&
    input.sku !== product.sku &&
    (await productRepo.findBySku(input.sku))
  ) {
    throw ApiError.conflict(constMessages.skuExists);
  }

  await productRepo.update(product, input);
  return success(constMessages.productUpdated, product);
};

const deleteProduct = async (id: string) => {
  const deleted = await productRepo.remove(id);

  if (!deleted) {
    throw ApiError.notFound(constMessages.productNotFound);
  }

  return success(constMessages.productDeleted, null);
};

export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
