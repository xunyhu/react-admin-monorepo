import { UserModel } from '../models/user.model';
import { MenuModel } from '../models/menu.model';

class UserService {
  async getUserInfo(userId: number) {
    return await UserModel.findById(userId);
  }

  async getUserList(params: any) {
    return await UserModel.findList(params);
  }

  async createUser(data: any) {
    // TODO: 加密密码（bcrypt）
    return await UserModel.create(data);
  }

  async updateUser(id: number, data: any) {
    const user = await UserModel.findById(id);

    // 🚨 超管保护
    if (user.role_code === 'super_admin' || user.is_system === 1) {
      throw Object.assign(new Error('超级管理员不可修改'), {
        code: 403,
      });
    }
    return await UserModel.update(id, data);
  }

  async deleteUser(id: number) {
    const roles = await UserModel.findRolesByUserId(id);

    const isSuperAdmin = roles.some(
      (role) => role.code === 'super_admin' || role.is_system === 1
    );

    if (isSuperAdmin) {
      throw Object.assign(new Error('超级管理员不可删除'), {
        code: 403,
      });
    }
    return await UserModel.delete(id);
  }

  async getUserPermissions(userId: number) {
    const permissionsRows = await MenuModel.findPermissionsByUserId(userId);
    const permissions = permissionsRows.map((i: any) => i.permission);

    return permissions;
  }
}

export default new UserService();
