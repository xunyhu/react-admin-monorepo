# 项目说明

这是一个企业级后台管理系统（react-admin-monorepo）。

当前项目已经具备：

* RBAC 权限系统
* 动态菜单
* 动态路由
* JWT 鉴权
* 页面权限控制
* 按钮权限控制
* pageDesign 装修系统
* schema 动态渲染

当前目标：

在现有 RBAC 系统基础上，
逐步扩展为一个电商后台管理系统。

---

# 技术栈

## 前端

* React
* TypeScript
* Vite
* React Router v6
* Ant Design
* Zustand
* Axios

项目：

apps/admin-web

---

## 后端

* Node.js
* Express
* MySQL

项目：

apps/admin-server

---

# Monorepo

使用：

* pnpm workspace
* turbo

共享包：

packages/shared

---

# 鉴权方式

* 使用 JWT
* token 存储在 localStorage
* 请求头：

Authorization: Bearer token

---

# 权限模型（RBAC）

数据库表：

* users
* roles
* menus
* role_menu

权限字段：

permission

例如：

* user:list
* user:create
* role:update

---

# 路由系统

使用：

* react-router v6
* 动态路由

动态路由基于后端返回 menus 生成。

相关目录：

src/router/

---

# 接口规范

baseURL：

/api

统一返回结构：

```ts
{
  code: number;
  message: string;
  data: any;
}
```

---

# 请求规范

统一使用：

src/utils/request.ts

禁止：

* 页面直接使用 axios
* 重复封装 request

API 文件统一放：

src/api/

例如：

* product.ts
* order.ts
* member.ts

---

# 页面开发规范

页面目录：

src/pages/

新增业务模块时：

module/
├── index.tsx
├── create.tsx
├── edit.tsx
├── detail.tsx
├── components/
├── hooks/

例如：

pages/product/
pages/order/

---

# React 开发规范

## 必须

* 使用函数组件
* 使用 TypeScript
* hooks 必须抽离
* 页面组件化
* TS 类型完整

---

## 禁止

* 使用 class component
* 滥用 any
* 页面中写大量业务逻辑
* 超大单文件

---

# 状态管理规范

使用：

* Zustand

已有 store：

src/store/

新增模块：

* 避免重复全局状态
* 页面局部状态优先使用 hooks

---

# UI 规范

使用：

* Ant Design

要求：

* 保持企业级后台风格
* 页面布局统一
* 表格风格统一
* 表单风格统一

---

# 表格规范

列表页必须支持：

* 搜索
* 分页
* loading
* 空状态

复杂表格：

* columns 单独抽离
* hooks 管理逻辑

---

# 表单规范

复杂表单：

* 拆分组件
* hooks 管理逻辑
* 校验规则完整

例如：

* SKU
* 动态规格
* 图片上传

---

# 后端开发规范

目录：

controllers/
services/
models/
routes/

新增模块必须包含：

* controller
* service
* route
* model

---

# 数据库规范

表名：

* 小写
* 下划线命名

例如：

* products
* product_skus
* orders

---

# 当前开发目标

当前优先开发：

1. Dashboard
2. 商品管理
3. 订单管理
4. 会员管理

后续扩展：

* CMS装修系统
* AI运营能力
* SaaS能力

---

# 开发原则

非常重要：

1. 不要重构现有架构
2. 不要修改 RBAC 核心逻辑
3. 优先复用已有组件
4. 保持当前目录结构
5. 保持当前代码风格
6. 尽量增量开发
7. 不要影响已有功能
