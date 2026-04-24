import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { permissionMiddleware } from '../middleware/permission.middleware';
import {
  createPageDesign,
  deletePageDesign,
  getPageDesign,
  listPageDesigns,
  updatePageDesign,
} from '../controllers/pageDesign.controller';

const router = express.Router();

// 列表
router.get(
  '/pages',
  authMiddleware,
  permissionMiddleware('design:list'),
  listPageDesigns
);

// 详情
router.get('/pages/:id', getPageDesign);

// 创建
router.post(
  '/pages',
  authMiddleware,
  permissionMiddleware('design:create'),
  createPageDesign
);

// 更新（全量保存）
router.put(
  '/pages/:id',
  authMiddleware,
  permissionMiddleware('design:update'),
  updatePageDesign
);

// 删除
router.delete(
  '/pages/:id',
  authMiddleware,
  permissionMiddleware('design:delete'),
  deletePageDesign
);

export default router;
