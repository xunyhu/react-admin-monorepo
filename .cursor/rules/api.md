# 接口调用规范

## baseURL

/api

## 请求头

Authorization: Bearer {token}

## 示例

### 登录

POST /api/login

返回：
{
code: 200,
data: {
token: string,
user: object,
menus: [],
permissions: []
}
}

### 用户列表

GET /api/users?page=1&pageSize=10

### 删除用户

DELETE /api/users/:id

## 错误处理

- code !== 200 时，前端提示 message
