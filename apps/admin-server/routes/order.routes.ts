import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { permissionMiddleware } from '../middleware/permission.middleware';
import {
  getOrderList,
  getOrderDetail,
  shipOrder,
  closeOrder,
  deleteOrder,
} from '../controllers/order.controller';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  permissionMiddleware('order:list'),
  getOrderList
);

router.get(
  '/:id',
  authMiddleware,
  permissionMiddleware('order:detail'),
  getOrderDetail
);

router.post(
  '/:id/ship',
  authMiddleware,
  permissionMiddleware('order:ship'),
  shipOrder
);

router.post(
  '/:id/close',
  authMiddleware,
  permissionMiddleware('order:close'),
  closeOrder
);

router.delete(
  '/:id',
  authMiddleware,
  permissionMiddleware('order:delete'),
  deleteOrder
);

export default router;
