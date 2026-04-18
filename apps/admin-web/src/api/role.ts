import request from '@/utils/request';

export const getRoles = () => request.get('/roles');

export const createRole = (data: any) => request.post('/roles', data);

export const updateRole = (id: number, data: any) =>
  request.put(`/roles/${id}`, data);

export const deleteRole = (id: number) => request.delete(`/roles/${id}`);

export const getRoleUserCount = (roleId: number) =>
  request.get(`/roles/${roleId}/user-count`);

export const getMenuTree = () => request.get('/menus/tree');

export const getRoleMenus = (roleId: number) =>
  request.get(`/roles/${roleId}/menus`);

export const saveRoleMenus = ({
  roleId,
  menuIds,
}: {
  roleId: number;
  menuIds: number[];
}) => request.put(`/roles/${roleId}/menus`, { roleId, menuIds });
