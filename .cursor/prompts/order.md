# 订单管理系统需求文档

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

订单管理系统（Order Module）

模块目录：

src/pages/order/

---

# 一、订单列表页

页面：

pages/order/index.tsx

---

## 页面功能

实现标准电商后台订单列表页。

---

## 搜索区域

支持：

1. 订单号搜索
2. 用户昵称搜索
3. 手机号搜索
4. 支付状态筛选
5. 发货状态筛选
6. 下单时间范围筛选

使用：

* Ant Design Form
* DatePicker.RangePicker

---

## 表格字段

Table 字段：

* 订单号
* 用户信息
* 商品信息
* 订单金额
* 商品数量
* 支付状态
* 发货状态
* 订单状态
* 下单时间
* 操作

---

## 用户信息展示

包含：

* 用户头像
* 用户昵称
* 手机号

---

## 商品信息展示

支持：

* 商品主图
* 商品名称
* SKU 信息

---

## 状态设计

### 支付状态

* 待支付
* 已支付
* 已退款

---

### 发货状态

* 待发货
* 已发货
* 已签收

---

### 订单状态

* 待支付
* 待发货
* 已完成
* 已关闭

---

## 操作按钮

支持：

1. 查看详情
2. 发货
3. 关闭订单
4. 删除订单

---

## Table 要求

必须支持：

* loading
* pagination
* rowSelection
* empty
* fixed columns

---

# 二、订单详情页

页面：

pages/order/detail.tsx

---

## 页面功能

展示完整订单详情。

---

## 页面模块

### 1. 基础信息

* 订单号
* 下单时间
* 支付时间
* 订单状态

---

### 2. 用户信息

* 用户头像
* 用户昵称
* 手机号

---

### 3. 收货信息

* 收货人
* 联系电话
* 收货地址

---

### 4. 商品信息

表格展示：

* 商品图片
* 商品名称
* SKU
* 单价
* 数量
* 小计

---

### 5. 金额信息

包含：

* 商品总额
* 运费
* 优惠金额
* 实付金额

---

### 6. 订单日志

时间轴展示：

* 创建订单
* 支付成功
* 商家发货
* 用户签收

使用：

* Ant Design Timeline

---

# 三、接口设计

请同时生成：

src/api/order.ts

接口：

* getOrderList
* getOrderDetail
* shipOrder
* closeOrder
* deleteOrder

统一使用：

src/utils/request.ts

---

# 四、TypeScript 类型

请生成：

* OrderItem
* OrderStatus
* PayStatus
* ShippingStatus
* OrderDetail

禁止使用 any。

---

# 五、Mock 数据

请提供：

* mock 订单列表
* mock 订单详情

要求：

* 数据真实
* 包含多个订单状态
* 包含 SKU 信息

---

# 六、组件拆分要求

请拆分：

components/
├── OrderSearch.tsx
├── OrderTable.tsx
├── OrderStatusTag.tsx
├── OrderAmountCard.tsx
├── OrderTimeline.tsx

---

# 七、hooks 拆分

hooks/
├── useOrderList.ts
├── useOrderDetail.ts

---

# 八、UI要求

保持：

* 企业级后台风格
* Ant Design 风格统一
* 页面整洁
* 信息层级清晰

---

# 九、输出要求

请输出：

1. 新增文件目录
2. 完整代码
3. hooks
4. types
5. mock 数据
6. api 文件
7. 页面说明

代码必须完整可运行。
