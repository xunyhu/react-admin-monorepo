import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getRoleUserCount,
  getRoleMenus,
  saveRoleMenus,
} from '../controllers/role.controller';

const router = express.Router();

router.get('/', authMiddleware, getRoles);

router.post('/', authMiddleware, createRole);

router.put('/:id', authMiddleware, updateRole);

router.delete('/:id', authMiddleware, deleteRole);

router.get('/:id/user-count', authMiddleware, getRoleUserCount);

router.get('/:roleId/menus', authMiddleware, getRoleMenus);

router.put('/:roleId/menus', authMiddleware, saveRoleMenus);

export default router;
