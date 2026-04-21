# 前端开发规范

## 技术要求

- 使用 React + TypeScript
- 使用函数组件 + Hooks
- UI 使用 antd

## 代码风格

- 使用 ES Module
- 使用 async/await，不使用 then
- 组件拆分清晰

## 请求规范

- 所有接口必须使用 utils/request.ts
- 不允许直接使用 axios

## 页面结构

标准页面结构：

1. 搜索区域（Form）
2. 操作按钮（新增等）
3. 表格（Table）
4. 分页（Pagination）

## 状态管理

- 使用 Zustand
- 用户信息使用 useAuthStore
- 菜单使用 useMenuStore

## 权限控制

- 按 permission 控制按钮显示
- 示例：user:list、user:create

## 路由

- 使用 createBrowserRouter
- 动态路由通过 generateRoutes(menus)

## 错误处理

- 使用 antd message 提示错误
