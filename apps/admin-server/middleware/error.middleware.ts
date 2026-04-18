import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('🔥 server error:', err);

  res.status(500).json({
    code: 500,
    message: err.message || '服务器内部错误',
    data: null,
  });
};
