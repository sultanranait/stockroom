import { PRODUCT_STATUSES } from '@shared/interfaces/product.interface';
import { authenticate } from '@shared/middlewares/auth.middleware';
import { authorize } from '@shared/middlewares/authorize.middleware';
import validate from '@shared/middlewares/validate.middleware';
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { productController } from './controllers/product.controller';
import constMessages from './utils/constants';

const router = Router();

const productId = param('id')
  .isUUID()
  .withMessage(constMessages.invalidProductId);

// Create needs every required field, update accepts any subset
const productBody = (isUpdate: boolean) => {
  const field = (name: string) => {
    return isUpdate ? body(name).optional() : body(name);
  };

  return [
    field('name')
      .isString()
      .trim()
      .isLength({ min: 2, max: 150 })
      .withMessage(constMessages.invalidName),
    field('sku')
      .isString()
      .trim()
      .matches(/^[A-Za-z0-9-]{3,64}$/)
      .withMessage(constMessages.invalidSku)
      .toUpperCase(),
    // null or a blank string clears the description
    body('description')
      .optional()
      .customSanitizer((value) => {
        return typeof value === 'string' ? value.trim() || null : value;
      })
      .custom((value) => {
        return (
          value === null || (typeof value === 'string' && value.length <= 2000)
        );
      })
      .withMessage(constMessages.invalidDescription),
    field('price')
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage(constMessages.invalidPrice)
      .isFloat({ min: 0, max: 99999999.99 })
      .withMessage(constMessages.invalidPrice)
      .toFloat(),
    body('quantity')
      .optional()
      .isInt({ min: 0, max: 1000000 })
      .withMessage(constMessages.invalidQuantity)
      .toInt(),
    body('status')
      .optional()
      .isIn(PRODUCT_STATUSES)
      .withMessage(constMessages.invalidStatus),
  ];
};

router.use(authenticate);

router.get(
  '/',
  validate([
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage(constMessages.invalidPage)
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage(constMessages.invalidLimit)
      .toInt(),
    query('search')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage(constMessages.invalidSearch),
    query('status')
      .optional()
      .isIn(PRODUCT_STATUSES)
      .withMessage(constMessages.invalidStatus),
  ]),
  productController.getProducts,
);

router.get('/:id', validate([productId]), productController.getProductById);

router.post('/', validate(productBody(false)), productController.createProduct);

router.patch(
  '/:id',
  validate([productId, ...productBody(true)]),
  productController.updateProduct,
);

router.delete(
  '/:id',
  authorize('admin'),
  validate([productId]),
  productController.deleteProduct,
);

export default router;
