import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { permissionMiddleware } from '../middleware/permission.middleware';
import {
  getMemberList,
  getMemberDetail,
  updateMember,
  updateMemberStatus,
} from '../controllers/member.controller';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  permissionMiddleware('member:list'),
  getMemberList
);

router.get(
  '/:id',
  authMiddleware,
  permissionMiddleware('member:detail'),
  getMemberDetail
);

router.put(
  '/:id',
  authMiddleware,
  permissionMiddleware('member:update'),
  updateMember
);

router.post(
  '/:id/status',
  authMiddleware,
  permissionMiddleware('member:disable'),
  updateMemberStatus
);

export default router;
