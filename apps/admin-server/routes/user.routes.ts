import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { permissionMiddleware } from '../middleware/permission.middleware';
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = express.Router();

// 分页列表
router.get('/', authMiddleware, permissionMiddleware('user:list'), getUserList);

// 新增
router.post('/', authMiddleware, permissionMiddleware('user:add'), createUser);

// 更新
router.put(
  '/:id',
  authMiddleware,
  permissionMiddleware('user:update'),
  updateUser
);

// 删除
router.delete(
  '/:id',
  authMiddleware,
  permissionMiddleware('user:delete'),
  deleteUser
);

export default router;
