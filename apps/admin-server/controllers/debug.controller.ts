import { Request, Response } from 'express';
import db from '../db';

export async function debugUserPermission(req: Request, res: Response) {
  const userId = Number(req.query.userId || 1);

  const [menus] = (await db.query(
    `
    SELECT m.*
    FROM menus m
    JOIN role_menu rm ON rm.menu_id = m.id
    JOIN user_role ur ON ur.role_id = rm.role_id
    WHERE ur.user_id = ?
  `,
    [userId]
  )) as any[];

  const [permissions] = (await db.query(
    `
    SELECT DISTINCT m.permission
    FROM menus m
    JOIN role_menu rm ON rm.menu_id = m.id
    JOIN user_role ur ON ur.role_id = rm.role_id
    WHERE ur.user_id = ?
    AND m.permission IS NOT NULL
  `,
    [userId]
  )) as any[];

  return res.json({
    userId,
    menusCount: menus.length,
    permissionsCount: permissions.length,
    menus,
    permissions,
  });
}
