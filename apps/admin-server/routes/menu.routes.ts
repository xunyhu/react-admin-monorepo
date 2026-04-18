import express from 'express';
import {
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenus,
} from '../controllers/menu.controller';

const router = express.Router();

router.get('/tree', getMenuTree);
router.get('/', getMenus);
router.post('/', createMenu);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

export default router;
