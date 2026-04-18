import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

/**
 * 权限校验 middleware
 * @param permission 例如：user:add
 */
export function permissionMiddleware(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({
        code: 401,
        message: '未登录',
      });
    }

    // 🔥 获取用户权限（可优化成缓存）
    const data = await userService.getUserPermissions(user.id);

    // console.log('用户权限列表：', data);
    // console.log('当前访问需要的权限：', permission);

    const hasPermission = data.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        code: 403,
        message: '无权限访问',
      });
    }

    next();
  };
}
