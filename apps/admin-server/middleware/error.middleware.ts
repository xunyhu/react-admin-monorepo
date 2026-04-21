import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('🔥 server error:', err);

  const status = Number(err?.status) || 500;
  res.status(status).json({
    code: status,
    message: err?.message || '服务器内部错误',
    data: null,
  });
};
