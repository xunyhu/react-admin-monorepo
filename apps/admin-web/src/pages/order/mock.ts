import type {
  OrderDetail,
  OrderItem,
  OrderListParams,
  ShippingStatus,
} from './types';

const mockOrderDetails: OrderDetail[] = [
  {
    id: 1,
    orderNo: 'ORD202605240001',
    user: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
      nickname: '张三',
      phone: '13800138001',
    },
    products: [
      {
        id: 101,
        image: 'https://picsum.photos/seed/headphone/80/80',
        name: '无线蓝牙耳机 Pro',
        sku: '黑色 / 标准版',
        price: 299.0,
        quantity: 1,
      },
      {
        id: 102,
        image: 'https://picsum.photos/seed/case/80/80',
        name: '耳机保护套',
        sku: '透明 / 通用',
        price: 29.0,
        quantity: 2,
      },
    ],
    totalAmount: 357.0,
    productCount: 3,
    payStatus: 'paid',
    shippingStatus: 'pending',
    orderStatus: 'pending_ship',
    createdAt: '2026-05-20 10:30:00',
    paidAt: '2026-05-20 10:32:15',
    address: {
      receiver: '张三',
      phone: '13800138001',
      address: '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 1208',
    },
    amount: {
      productTotal: 357.0,
      freight: 0,
      discount: 0,
      paidAmount: 357.0,
    },
    logs: [
      { type: 'created', content: '用户提交订单', time: '2026-05-20 10:30:00' },
      { type: 'paid', content: '支付成功，微信支付 ¥357.00', time: '2026-05-20 10:32:15' },
    ],
  },
  {
    id: 2,
    orderNo: 'ORD202605240002',
    user: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
      nickname: '李四',
      phone: '13900139002',
    },
    products: [
      {
        id: 201,
        image: 'https://picsum.photos/seed/shirt/80/80',
        name: '纯棉休闲 T 恤',
        sku: '白色 / L',
        price: 89.0,
        quantity: 2,
      },
    ],
    totalAmount: 178.0,
    productCount: 2,
    payStatus: 'paid',
    shippingStatus: 'shipped',
    orderStatus: 'pending_ship',
    createdAt: '2026-05-18 14:20:00',
    paidAt: '2026-05-18 14:21:30',
    address: {
      receiver: '李四',
      phone: '13900139002',
      address: '上海市浦东新区陆家嘴环路 1000 号 恒生银行大厦 25 层',
    },
    amount: {
      productTotal: 178.0,
      freight: 10.0,
      discount: 10.0,
      paidAmount: 178.0,
    },
    logs: [
      { type: 'created', content: '用户提交订单', time: '2026-05-18 14:20:00' },
      { type: 'paid', content: '支付成功，支付宝 ¥178.00', time: '2026-05-18 14:21:30' },
      {
        type: 'shipped',
        content: '商家已发货，顺丰速运 SF1234567890',
        time: '2026-05-19 09:15:00',
      },
    ],
  },
  {
    id: 3,
    orderNo: 'ORD202605240003',
    user: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
      nickname: '王五',
      phone: '13700137003',
    },
    products: [
      {
        id: 301,
        image: 'https://picsum.photos/seed/lamp/80/80',
        name: '北欧风护眼台灯',
        sku: '暖白色 / 触控版',
        price: 199.0,
        quantity: 1,
      },
    ],
    totalAmount: 199.0,
    productCount: 1,
    payStatus: 'paid',
    shippingStatus: 'received',
    orderStatus: 'completed',
    createdAt: '2026-05-10 16:45:00',
    paidAt: '2026-05-10 16:46:20',
    address: {
      receiver: '王五',
      phone: '13700137003',
      address: '广州市天河区珠江新城花城大道 85 号 高德置地春广场',
    },
    amount: {
      productTotal: 199.0,
      freight: 0,
      discount: 0,
      paidAmount: 199.0,
    },
    logs: [
      { type: 'created', content: '用户提交订单', time: '2026-05-10 16:45:00' },
      { type: 'paid', content: '支付成功，微信支付 ¥199.00', time: '2026-05-10 16:46:20' },
      {
        type: 'shipped',
        content: '商家已发货，中通快递 ZTO9876543210',
        time: '2026-05-11 10:00:00',
      },
      { type: 'received', content: '用户已签收', time: '2026-05-13 18:30:00' },
    ],
  },
  {
    id: 4,
    orderNo: 'ORD202605240004',
    user: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
      nickname: '赵六',
      phone: '13600136004',
    },
    products: [
      {
        id: 401,
        image: 'https://picsum.photos/seed/book/80/80',
        name: '前端架构实战',
        sku: '精装版 / 签名版',
        price: 68.0,
        quantity: 1,
      },
    ],
    totalAmount: 68.0,
    productCount: 1,
    payStatus: 'pending',
    shippingStatus: 'pending',
    orderStatus: 'pending_pay',
    createdAt: '2026-05-24 09:00:00',
    address: {
      receiver: '赵六',
      phone: '13600136004',
      address: '深圳市南山区科技园南区深南大道 9988 号',
    },
    amount: {
      productTotal: 68.0,
      freight: 0,
      discount: 0,
      paidAmount: 68.0,
    },
    logs: [{ type: 'created', content: '用户提交订单', time: '2026-05-24 09:00:00' }],
  },
  {
    id: 5,
    orderNo: 'ORD202605240005',
    user: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi',
      nickname: '孙七',
      phone: '13500135005',
    },
    products: [
      {
        id: 501,
        image: 'https://picsum.photos/seed/nuts/80/80',
        name: '有机坚果礼盒',
        sku: '混合装 / 500g',
        price: 158.0,
        quantity: 1,
      },
    ],
    totalAmount: 158.0,
    productCount: 1,
    payStatus: 'refunded',
    shippingStatus: 'pending',
    orderStatus: 'closed',
    createdAt: '2026-05-15 11:30:00',
    paidAt: '2026-05-15 11:31:00',
    address: {
      receiver: '孙七',
      phone: '13500135005',
      address: '杭州市西湖区文三路 478 号华星时代广场',
    },
    amount: {
      productTotal: 158.0,
      freight: 0,
      discount: 0,
      paidAmount: 158.0,
    },
    logs: [
      { type: 'created', content: '用户提交订单', time: '2026-05-15 11:30:00' },
      { type: 'paid', content: '支付成功，微信支付 ¥158.00', time: '2026-05-15 11:31:00' },
      { type: 'created', content: '用户申请退款，订单已关闭', time: '2026-05-16 08:20:00' },
    ],
  },
  {
    id: 6,
    orderNo: 'ORD202605240006',
    user: {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouba',
      nickname: '周八',
      phone: '13400134006',
    },
    products: [
      {
        id: 601,
        image: 'https://picsum.photos/seed/keyboard/80/80',
        name: '机械键盘',
        sku: '青轴 / RGB 背光',
        price: 459.0,
        quantity: 1,
      },
      {
        id: 602,
        image: 'https://picsum.photos/seed/mouse/80/80',
        name: '无线鼠标',
        sku: '黑色 / 2.4G',
        price: 129.0,
        quantity: 1,
      },
    ],
    totalAmount: 588.0,
    productCount: 2,
    payStatus: 'paid',
    shippingStatus: 'pending',
    orderStatus: 'closed',
    createdAt: '2026-05-12 20:15:00',
    paidAt: '2026-05-12 20:16:00',
    address: {
      receiver: '周八',
      phone: '13400134006',
      address: '成都市武侯区天府大道北段 1700 号环球中心',
    },
    amount: {
      productTotal: 588.0,
      freight: 0,
      discount: 0,
      paidAmount: 588.0,
    },
    logs: [
      { type: 'created', content: '用户提交订单', time: '2026-05-12 20:15:00' },
      { type: 'paid', content: '支付成功，支付宝 ¥588.00', time: '2026-05-12 20:16:00' },
      { type: 'created', content: '商家关闭订单：库存不足', time: '2026-05-13 09:00:00' },
    ],
  },
];

let orderStore: OrderDetail[] = mockOrderDetails.map((item) => ({ ...item }));

function toOrderItem(detail: OrderDetail): OrderItem {
  const { paidAt: _paidAt, address: _address, amount: _amount, logs: _logs, ...item } =
    detail;
  return item;
}

export function filterMockOrders(params: OrderListParams) {
  const {
    page,
    pageSize,
    orderNo,
    nickname,
    phone,
    payStatus,
    shippingStatus,
    startTime,
    endTime,
  } = params;

  let filtered = orderStore.map(toOrderItem);

  if (orderNo) {
    filtered = filtered.filter((item) => item.orderNo.includes(orderNo));
  }

  if (nickname) {
    filtered = filtered.filter((item) => item.user.nickname.includes(nickname));
  }

  if (phone) {
    filtered = filtered.filter((item) => item.user.phone.includes(phone));
  }

  if (payStatus) {
    filtered = filtered.filter((item) => item.payStatus === payStatus);
  }

  if (shippingStatus) {
    filtered = filtered.filter((item) => item.shippingStatus === shippingStatus);
  }

  if (startTime) {
    filtered = filtered.filter((item) => item.createdAt >= startTime);
  }

  if (endTime) {
    filtered = filtered.filter((item) => item.createdAt <= `${endTime} 23:59:59`);
  }

  const start = (page - 1) * pageSize;

  return {
    list: filtered.slice(start, start + pageSize),
    total: filtered.length,
  };
}

export function getMockOrderDetail(id: number): OrderDetail | null {
  const detail = orderStore.find((item) => item.id === id);
  return detail ? { ...detail } : null;
}

export function mockShipOrder(id: number): boolean {
  const index = orderStore.findIndex((item) => item.id === id);
  if (index === -1) return false;

  const order = orderStore[index];
  if (order.payStatus !== 'paid' || order.shippingStatus !== 'pending') {
    return false;
  }

  const now = formatNow();
  orderStore[index] = {
    ...order,
    shippingStatus: 'shipped' as ShippingStatus,
    orderStatus: order.orderStatus === 'pending_ship' ? 'pending_ship' : order.orderStatus,
    logs: [
      ...order.logs,
      {
        type: 'shipped',
        content: `商家已发货，顺丰速运 SF${Date.now().toString().slice(-10)}`,
        time: now,
      },
    ],
  };

  return true;
}

export function mockCloseOrder(id: number): boolean {
  const index = orderStore.findIndex((item) => item.id === id);
  if (index === -1) return false;

  const order = orderStore[index];
  if (order.orderStatus === 'completed' || order.orderStatus === 'closed') {
    return false;
  }

  const now = formatNow();
  orderStore[index] = {
    ...order,
    orderStatus: 'closed',
    logs: [
      ...order.logs,
      { type: 'created', content: '商家关闭订单', time: now },
    ],
  };

  return true;
}

export function mockDeleteOrder(id: number): boolean {
  const index = orderStore.findIndex((item) => item.id === id);
  if (index === -1) return false;

  orderStore = orderStore.filter((item) => item.id !== id);
  return true;
}

function formatNow() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export const mockOrders = orderStore.map(toOrderItem);
