# React Admin System

一个基于 React + Node.js + MySQL 的全栈后台管理系统，采用 monorepo 架构实现前后端分离开发。

## 🚀 技术栈

### 前端（admin-web）

- React 18
- TypeScript
- Vite
- Ant Design
- Axios
- React Router

### 后端（admin-server）

- Node.js
- Express
- TypeScript
- MySQL2
- RESTful API

### 工程化

- pnpm workspace
- Monorepo
- Turbo（可扩展）

## 📁 项目结构

```text
react-admin-monorepo/
├─ apps/
│ ├─ admin-web # 前端管理系统
│ └─ admin-server # 后端服务
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

## 🚀 启动方式

### 1️⃣ 安装依赖

```bash
pnpm install
```

### 2️⃣ 启动后端

```bash
pnpm --filter admin-server build
pnpm --filter admin-server start
```

### 3️⃣ 启动前端

```bash
cd apps/admin-web
pnpm dev
# 或者
pnpm --filter admin-web dev
```

## 🌐 访问地址

- 前端：http://localhost:5173
- 后端：http://localhost:3001
