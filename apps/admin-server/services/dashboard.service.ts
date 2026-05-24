const dashboardOverview = {
  todaySales: {
    value: 128560.5,
    compare: { value: 12.6, direction: 'up' as const, label: '较昨日' },
  },
  todayOrders: {
    value: 386,
    compare: { value: 8.3, direction: 'up' as const, label: '较昨日' },
  },
  todayNewUsers: {
    value: 127,
    compare: { value: 5.2, direction: 'down' as const, label: '较昨日' },
  },
  monthSales: {
    value: 2856320.8,
    compare: { value: 18.4, direction: 'up' as const, label: '较上月' },
  },
  payConversionRate: {
    value: 68.5,
    compare: { value: 2.1, direction: 'up' as const, label: '较上周' },
  },
  refundRate: {
    value: 3.2,
    compare: { value: 0.8, direction: 'down' as const, label: '较上周' },
  },
};

function last7Days() {
  const dates: string[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${month}-${day}`);
  }

  return dates;
}

const dates = last7Days();

const salesTrend = dates.map((date, index) => ({
  date,
  amount: [86520, 92340, 88760, 95680, 102350, 118920, 128560][index],
}));

const orderTrend = dates.map((date, index) => ({
  date,
  count: [268, 295, 281, 312, 338, 365, 386][index],
}));

const userTrend = dates.map((date, index) => ({
  date,
  count: [86, 102, 95, 118, 109, 134, 127][index],
}));

const topProducts = [
  {
    id: 1,
    name: '无线蓝牙耳机 Pro',
    sales: 1286,
    amount: 384580,
    conversionRate: 12.8,
  },
  {
    id: 2,
    name: '智能运动手表',
    sales: 956,
    amount: 573600,
    conversionRate: 10.5,
  },
  {
    id: 3,
    name: '纯棉 T 恤（夏季款）',
    sales: 2340,
    amount: 208260,
    conversionRate: 8.6,
  },
  {
    id: 4,
    name: '有机坚果礼盒',
    sales: 680,
    amount: 107440,
    conversionRate: 7.2,
  },
  {
    id: 5,
    name: '便携榨汁杯',
    sales: 520,
    amount: 93600,
    conversionRate: 6.9,
  },
];

const categoryStats = [
  { name: '数码电子', value: 35.2 },
  { name: '服装鞋帽', value: 24.6 },
  { name: '食品饮料', value: 16.8 },
  { name: '家居生活', value: 12.4 },
  { name: '美妆个护', value: 11.0 },
];

const lowStock = [
  { id: 3, name: '有机坚果礼盒', stock: 12, threshold: 50 },
  { id: 8, name: '儿童绘本套装', stock: 8, threshold: 30 },
  { id: 12, name: '防晒喷雾 50ml', stock: 15, threshold: 40 },
  { id: 15, name: '不锈钢保温杯', stock: 6, threshold: 25 },
  { id: 18, name: '瑜伽垫（加厚款）', stock: 18, threshold: 35 },
];

const realtime = {
  recentOrders: [
    {
      orderNo: 'ORD202605240386',
      nickname: '张三',
      amount: 357.0,
      createdAt: '2026-05-24 14:32:18',
    },
    {
      orderNo: 'ORD202605240385',
      nickname: '李四',
      amount: 1280.0,
      createdAt: '2026-05-24 14:28:05',
    },
    {
      orderNo: 'ORD202605240384',
      nickname: '王五',
      amount: 199.0,
      createdAt: '2026-05-24 14:15:42',
    },
    {
      orderNo: 'ORD202605240383',
      nickname: '赵六',
      amount: 68.0,
      createdAt: '2026-05-24 14:02:30',
    },
    {
      orderNo: 'ORD202605240382',
      nickname: '孙七',
      amount: 588.0,
      createdAt: '2026-05-24 13:48:16',
    },
  ],
  recentPayments: [
    {
      orderNo: 'ORD202605240386',
      amount: 357.0,
      paidAt: '2026-05-24 14:33:02',
    },
    {
      orderNo: 'ORD202605240385',
      amount: 1280.0,
      paidAt: '2026-05-24 14:29:18',
    },
    {
      orderNo: 'ORD202605240384',
      amount: 199.0,
      paidAt: '2026-05-24 14:16:55',
    },
    {
      orderNo: 'ORD202605240381',
      amount: 256.0,
      paidAt: '2026-05-24 13:35:40',
    },
    {
      orderNo: 'ORD202605240380',
      amount: 899.0,
      paidAt: '2026-05-24 13:20:12',
    },
  ],
  recentUsers: [
    {
      nickname: '新用户_小明',
      phone: '138****8821',
      createdAt: '2026-05-24 14:30:00',
    },
    {
      nickname: '新用户_小红',
      phone: '139****6632',
      createdAt: '2026-05-24 14:12:35',
    },
    {
      nickname: '新用户_大伟',
      phone: '137****4410',
      createdAt: '2026-05-24 13:55:20',
    },
    {
      nickname: '新用户_阿花',
      phone: '136****2298',
      createdAt: '2026-05-24 13:40:08',
    },
    {
      nickname: '新用户_建国',
      phone: '135****1187',
      createdAt: '2026-05-24 13:25:45',
    },
  ],
};

export const dashboardService = {
  getOverview() {
    return dashboardOverview;
  },

  getSalesTrend() {
    return salesTrend;
  },

  getOrderTrend() {
    return orderTrend;
  },

  getUserTrend() {
    return userTrend;
  },

  getTopProducts() {
    return topProducts;
  },

  getCategoryStats() {
    return categoryStats;
  },

  getChartsData() {
    return {
      orderTrend,
      userTrend,
      topProducts,
      categoryStats,
      lowStock,
      realtime,
    };
  },
};

export default dashboardService;
