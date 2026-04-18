import { UserModel } from '../models/user.model';
import { RoleModel } from '../models/role.model';
import { MenuModel } from '../models/menu.model';
import { buildTree } from '../utils/tree';
import { signToken } from '../utils/jwt';

export class AuthService {
  async login(username: string, password: string) {
    // 1️⃣ 查用户
    const user = await UserModel.findByUsername(username);

    if (!user) {
      throw new Error('用户不存在');
    }

    if (user.password !== password) {
      throw new Error('密码错误');
    }

    const userId = user.id;

    // 2️⃣ roles
    const roles = await RoleModel.findRolesByUserId(userId);

    // 3️⃣ menus
    const menus = await MenuModel.findMenusByUserId(userId);

    // 4️⃣ permissions
    const permissionsRows = await MenuModel.findPermissionsByUserId(userId);
    const permissions = permissionsRows.map((i: any) => i.permission);

    // 5️⃣ token
    const token = signToken({
      id: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      roles: roles.map((r) => r.code),
      menus: buildTree(menus),
      permissions,
    };
  }
}

export default new AuthService();
