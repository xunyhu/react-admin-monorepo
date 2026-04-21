# 项目说明

这是一个后台管理系统：

## 技术栈

- 前端：admin-web（React + TypeScript + Vite）
- 后端：admin-server（Node.js + Express）
- UI：Ant Design
- 状态管理：Zustand
- 请求库：Axios（封装在 utils/request.ts）

## 鉴权方式

- 使用 JWT
- token 存储在 localStorage
- 请求头：Authorization: Bearer token

## 权限模型（RBAC）

表结构：

- users
- roles
- menus
- role_menu

权限字段：

- permission（如：user:list、user:create）

## 路由

- 使用 react-router v6
- 动态路由基于后端返回 menus 生成

## 接口规范

- baseURL: /api
- 返回结构：
  {
  code: number,
  message: string,
  data: any
  }

## 开发要求

- 所有代码必须符合当前项目结构
- 优先复用已有封装（request.ts、store 等）
