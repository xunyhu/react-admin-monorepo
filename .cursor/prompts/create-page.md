# 页面开发 Prompt

基于当前 react-admin-monorepo 项目继续开发。

请严格遵守：

* .cursor/rules/project.md
* 当前项目架构
* 当前代码风格

---

# 开发目标

生成一个标准企业级后台页面。

技术要求：

* React
* TypeScript
* Ant Design
* React Router v6
* Zustand
* Axios

---

# 页面要求

页面必须包含：

1. 搜索表单
2. Table 表格
3. 分页
4. loading 状态
5. 空状态
6. 操作按钮

---

# 请求要求

* 使用 src/utils/request.ts
* API 单独放 src/api/
* 不允许页面直接写 axios

---

# 页面结构要求

页面目录：

module/
├── index.tsx
├── components/
├── hooks/
├── types.ts

---

# 代码规范

必须：

* 使用函数组件
* 使用 TypeScript
* hooks 抽离
* columns 单独抽离
* TS 类型完整
* 组件化拆分

禁止：

* 使用 any
* 单文件超过 300 行
* 页面中写大量业务逻辑

---

# Table 要求

表格必须支持：

* loading
* pagination
* rowKey
* empty 状态

操作列支持：

* 编辑
* 删除
* 查看详情

---

# SearchForm 要求

支持：

* 查询
* 重置

使用：

* antd Form

---

# 输出要求

请输出：

1. 新增文件目录
2. index.tsx 完整代码
3. hooks
4. types.ts
5. api 文件
6. columns 配置
7. mock 数据
8. 页面说明

---
