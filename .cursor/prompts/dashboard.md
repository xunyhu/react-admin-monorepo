# Dashboard 数据看板需求文档

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

电商后台 Dashboard 数据看板

模块路径：

src/pages/dashboard/

---

# 一、页面目标

构建一个企业级电商运营数据看板页面。

用于展示：

* 业务概览
* 运营指标
* 趋势分析
* 数据洞察

---

# 二、顶部统计卡片（核心）

展示 4~6 个指标卡：

## 指标

* 今日销售额
* 今日订单数
* 今日新增用户
* 本月销售额
* 支付转化率
* 退款率

---

## UI要求

* Ant Design Card
* 数字高亮
* 支持涨跌趋势（↑ ↓）
* 显示同比昨日/上周

---

# 三、趋势图（核心）

使用 ECharts

## 图表1：销售趋势

* 最近7天销售额折线图

## 图表2：订单趋势

* 订单数量折线图

## 图表3：用户增长

* 新增用户趋势图

---

# 四、业务模块分析

## 1. 商品排行

Table展示：

* 商品名称
* 销量
* 销售额
* 转化率

---

## 2. 热门分类

饼图：

* 分类占比

---

## 3. 库存预警

列表：

* 库存低商品
* 库存数量

---

# 五、实时数据模块（可选增强）

展示：

* 最近订单（实时）
* 最近支付记录
* 最近注册用户

---

# 六、接口设计

生成：

src/api/dashboard.ts

接口：

* getDashboardOverview
* getSalesTrend
* getOrderTrend
* getUserTrend
* getTopProducts
* getCategoryStats

---

# 七、TypeScript 类型

请生成：

* DashboardOverview
* SalesTrendItem
* OrderTrendItem
* UserTrendItem
* TopProductItem

禁止使用 any。

---

# 八、组件拆分

components/
├── StatCard.tsx
├── SalesChart.tsx
├── OrderChart.tsx
├── UserChart.tsx
├── TopProductTable.tsx
├── CategoryPieChart.tsx
├── LowStockAlert.tsx

---

# 九、hooks拆分

hooks/
├── useDashboardOverview.ts
├── useSalesTrend.ts
├── useDashboardCharts.ts

---

# 十、数据要求

mock 数据必须：

* 接近真实电商数据
* 有趋势变化
* 有涨跌对比
* 有时间维度

---

# 十一、UI要求

必须：

* 企业级后台风格
* 卡片化布局
* 图表清晰
* 信息层级合理
* 页面不能空

---

# 十二、输出要求

请输出：

1. 新增文件结构
2. 完整代码
3. hooks
4. types
5. api 文件
6. mock 数据
7. 页面说明

代码必须完整可运行。
