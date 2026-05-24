import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { permissionMiddleware } from '../middleware/permission.middleware';
import {
  getProductList,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  permissionMiddleware('product:list'),
  getProductList
);

router.post(
  '/',
  authMiddleware,
  permissionMiddleware('product:add'),
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  permissionMiddleware('product:update'),
  updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  permissionMiddleware('product:delete'),
  deleteProduct
);

export default router;
