import { Router } from 'express';

import {
  getCategoryStats,
  getDashboardCharts,
  getDashboardOverview,
  getOrderTrend,
  getSalesTrend,
  getTopProducts,
  getUserTrend,
} from '../controllers/dashboard.controller';

const router = Router();

router.get('/overview', getDashboardOverview);
router.get('/sales-trend', getSalesTrend);
router.get('/order-trend', getOrderTrend);
router.get('/user-trend', getUserTrend);
router.get('/top-products', getTopProducts);
router.get('/category-stats', getCategoryStats);
router.get('/charts', getDashboardCharts);

export default router;
