# 登录鉴权系统（JWT）

## 🔑 登录流程

- 用户登录
- 后端返回 JWT
- 前端保存 token
- Axios 自动带 token

## 🧠 token 存储

localStorage.setItem('token', token)

## 🚨 401 处理

- token 失效
- 自动跳转登录页
- 清除本地 token
