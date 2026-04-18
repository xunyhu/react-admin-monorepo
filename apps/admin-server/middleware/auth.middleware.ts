import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未登录',
    });
  }

  try {
    const decoded = verifyToken(token);

    // ✅ 把 user 挂到 req 上
    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: 'token无效或已过期',
    });
  }
}
