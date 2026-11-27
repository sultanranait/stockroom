import {
  ProductFilters,
  ProductInput,
} from '@shared/interfaces/product.interface';
import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { productService } from '../services/product.service';

// matchedData returns only validated fields, already sanitized (trimmed, cast)
const getProducts = async (req: Request, res: Response) => {
  const filters = matchedData<ProductFilters>(req, { locations: ['query'] });
  const result = await productService.getProducts(filters);
  res.status(result.statusCode).json(result);
};

type IdParams = { id: string };

const getProductById = async (req: Request<IdParams>, res: Response) => {
  const result = await productService.getProductById(req.params.id);
  res.status(result.statusCode).json(result);
};

const createProduct = async (req: Request, res: Response) => {
  const input = matchedData<ProductInput>(req, { locations: ['body'] });
  const result = await productService.createProduct(input, req.user!.id);
  res.status(result.statusCode).json(result);
};

const updateProduct = async (req: Request<IdParams>, res: Response) => {
  const input = matchedData<Partial<ProductInput>>(req, {
    locations: ['body'],
  });
  const result = await productService.updateProduct(req.params.id, input);
  res.status(result.statusCode).json(result);
};

const deleteProduct = async (req: Request<IdParams>, res: Response) => {
  const result = await productService.deleteProduct(req.params.id);
  res.status(result.statusCode).json(result);
};

export const productController = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
