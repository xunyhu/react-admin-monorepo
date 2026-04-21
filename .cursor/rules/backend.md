# 后端开发规范

## 技术栈

- Node.js + Express
- 使用 TypeScript

## 返回结构

统一返回：
{
code: number,
message: string,
data: any
}

## 路由规范

- /api/login
- /api/users
- /api/roles
- /api/menus

## 鉴权

- 使用 JWT
- 除登录外接口必须走 authMiddleware

## 权限控制

- 基于 RBAC
- 通过角色 -> 菜单 -> permission 控制

## 错误处理

- 使用统一 errorMiddleware

## 数据库

- MySQL
- 表：users、roles、menus、role_menu
