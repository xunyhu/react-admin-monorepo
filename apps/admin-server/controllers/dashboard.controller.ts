import { Request, Response } from 'express';

import dashboardService from '../services/dashboard.service';

export async function getDashboardOverview(_req: Request, res: Response) {
  res.json({
    code: 200,
    message: 'success',
    data: dashboardService.getOverview(),
  });
}

export async function getSalesTrend(_req: Request, res: Response) {
  res.json({
    code: 200,
    message: 'success',
    data: dashboardService.getSalesTrend(),
  });
}

export async function getOrderTrend(_req: Request, res: Response) {
  res.json({
    code: 200,
    message: 'success',
    data: dashboardService.getOrderTrend(),
  });
}

export async function getUserTrend(_req: Request, res: Response) {
  res.json({
    code: 200,
    message: 'success',
    data: dashboardService.getUserTrend(),
  });
}

export async function getTopProducts(_req: Request, res: Response) {
  res.json({
    code: 200,
    message: 'success',
    data: dashboardService.getTopProducts(),
  });
}

export async function getCategoryStats(_req: Request, res: Response) {
  res.json({
    code: 200,
    message: 'success',
    data: dashboardService.getCategoryStats(),
  });
}

export async function getDashboardCharts(_req: Request, res: Response) {
  res.json({
    code: 200,
    message: 'success',
    data: dashboardService.getChartsData(),
  });
}
