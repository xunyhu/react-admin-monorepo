# 会员系统需求文档

基于当前 react-admin-monorepo 项目继续开发。

请严格遵守：

* .cursor/rules/project.md
* 当前项目架构
* 当前代码风格

不要重构现有架构。

不要修改 RBAC 核心逻辑。

---

# 当前开发目标

开发：

会员管理系统（Member Module）

模块目录：

src/pages/member/

---

# 一、会员列表页

页面：

pages/member/index.tsx

---

## 页面功能

实现标准电商后台会员管理页面。

---

## 搜索区域

支持：

1. 用户昵称搜索
2. 手机号搜索
3. 用户等级筛选
4. 注册时间范围筛选

使用：

* Ant Design Form
* DatePicker.RangePicker

---

## Table 字段

* 用户ID
* 用户头像
* 用户昵称
* 手机号
* 用户等级
* 积分
* 订单数量
* 消费总额
* 注册时间
* 状态
* 操作

---

## 操作按钮

支持：

1. 查看详情
2. 编辑会员
3. 禁用会员

---

## Table 要求

必须支持：

* loading
* pagination
* rowKey
* empty
* fixed columns

---

# 二、会员详情页

页面：

pages/member/detail.tsx

---

## 页面模块

### 1. 基础信息

* 用户头像
* 用户昵称
* 手机号
* 用户等级
* 注册时间

---

### 2. 用户统计

展示：

* 累计订单数
* 累计消费金额
* 最近下单时间
* 当前积分

使用：

* Statistic Card

---

### 3. 收货地址

展示地址列表：

* 收货人
* 手机号
* 地址
* 默认地址

---

### 4. 最近订单

Table 展示：

* 订单号
* 金额
* 状态
* 下单时间

---

### 5. 积分记录

展示：

* 积分变动
* 来源
* 时间

---

# 三、接口设计

生成：

src/api/member.ts

接口：

* getMemberList
* getMemberDetail
* updateMemberStatus

统一使用：

src/utils/request.ts

---

# 四、TypeScript 类型

请生成：

* MemberItem
* MemberLevel
* MemberAddress
* MemberOrder
* MemberPointLog

禁止使用 any。

---

# 五、Mock 数据

请提供：

* mock 会员列表
* mock 会员详情
* mock 地址数据
* mock 订单数据

数据要求真实。

---

# 六、组件拆分要求

components/
├── MemberSearch.tsx
├── MemberTable.tsx
├── MemberStatisticCards.tsx
├── MemberAddressList.tsx
├── MemberOrderTable.tsx
├── MemberPointTable.tsx

---

# 七、hooks 拆分

hooks/
├── useMemberList.ts
├── useMemberDetail.ts

---

# 八、UI要求

保持：

* 企业级后台风格
* 信息层级清晰
* 页面简洁
* Ant Design 风格统一

---

# 九、输出要求

请输出：

1. 新增文件目录
2. 完整代码
3. hooks
4. types
5. api 文件
6. mock 数据
7. 页面说明

代码必须完整可运行。
