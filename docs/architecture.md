# 系统架构设计

## 🧱 整体结构

前端（admin-web）
↓
API（admin-server）
↓
数据库（Mock / 可扩展 MySQL）

## 📦 Monorepo 架构

使用 pnpm workspace + turbo：

- apps：admin-web / admin-server
- packages：shared 工具库

## 🔐 登录流程

1. 用户输入账号密码
2. 后端生成 JWT token
3. 前端存储 token（localStorage）
4. 请求自动携带 token
5. 后端校验 token

## 📊 Dashboard 数据流

mock API → React state → ECharts 渲染
