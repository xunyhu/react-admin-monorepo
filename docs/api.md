# API 规范

## 请求格式

统一使用 axios instance

## 返回结构

```ts
{
  code: number;
  data: any;
  message: string;
}
```

## 鉴权方式

Bearer Token

Authorization: Bearer xxx
