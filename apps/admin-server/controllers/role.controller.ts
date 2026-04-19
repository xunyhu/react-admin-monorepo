import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';

export const getRoles = async (req: Request, res: Response) => {
  const data = await RoleService.getRoles();
  res.json({ code: 200, data });
};

export const createRole = async (req: Request, res: Response) => {
  await RoleService.createRole(req.body);
  res.json({ code: 200, message: 'ok' });
};

export const updateRole = async (req: Request, res: Response) => {
  await RoleService.updateRole(Number(req.params.id), req.body);
  res.json({ code: 200, message: 'ok' });
};

export const deleteRole = async (req: Request, res: Response) => {
  await RoleService.deleteRole(Number(req.params.id));
  res.json({ code: 200, message: 'ok' });
};

export const getRoleUserCount = async (req: Request, res: Response) => {
  const id = req.params.id;

  const count = await RoleService.getRoleUserCount(Number(id));

  res.json({
    code: 200,
    data: count,
  });
};

export const getRoleMenus = async (req: Request, res: Response) => {
  const roleId = Number(req.params.roleId);

  const rows = await RoleService.getRoleMenus(roleId);

  res.json({
    code: 200,
    data: rows,
  });
};

export const saveRoleMenus = async (req: Request, res: Response) => {
  const roleId = Number(req.params.roleId);
  const { menuIds } = req.body;

  await RoleService.saveMenus(roleId, menuIds || []);

  res.json({
    code: 200,
    message: 'ok',
  });
};
