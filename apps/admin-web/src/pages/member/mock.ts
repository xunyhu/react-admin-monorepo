import type {
  MemberDetail,
  MemberItem,
  MemberListParams,
  MemberStatus,
} from './types';

const mockMemberDetails: MemberDetail[] = [
  {
    id: 1,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    nickname: '张三',
    phone: '13800138001',
    level: 'gold',
    points: 3580,
    orderCount: 12,
    totalSpent: 8650.0,
    createdAt: '2025-08-15 09:20:00',
    status: 'active',
    lastOrderAt: '2026-05-20 10:30:00',
    addresses: [
      {
        id: 1,
        receiver: '张三',
        phone: '13800138001',
        address: '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 1208',
        isDefault: true,
      },
      {
        id: 2,
        receiver: '张三',
        phone: '13800138001',
        address: '北京市海淀区中关村大街 1 号 海龙大厦 15 层',
        isDefault: false,
      },
    ],
    recentOrders: [
      {
        id: 1,
        orderNo: 'ORD202605240001',
        amount: 357.0,
        status: 'pending_ship',
        createdAt: '2026-05-20 10:30:00',
      },
      {
        id: 7,
        orderNo: 'ORD202604120007',
        amount: 1280.0,
        status: 'completed',
        createdAt: '2026-04-12 16:45:00',
      },
    ],
    pointLogs: [
      { id: 1, change: 357, source: '订单消费赠送', createdAt: '2026-05-20 10:32:15' },
      { id: 2, change: -200, source: '积分兑换优惠券', createdAt: '2026-05-18 14:00:00' },
      { id: 3, change: 1280, source: '订单消费赠送', createdAt: '2026-04-12 16:46:00' },
    ],
  },
  {
    id: 2,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    nickname: '李四',
    phone: '13900139002',
    level: 'silver',
    points: 1260,
    orderCount: 6,
    totalSpent: 3280.5,
    createdAt: '2025-11-02 14:30:00',
    status: 'active',
    lastOrderAt: '2026-05-18 14:20:00',
    addresses: [
      {
        id: 3,
        receiver: '李四',
        phone: '13900139002',
        address: '上海市浦东新区陆家嘴环路 1000 号 恒生银行大厦 25 层',
        isDefault: true,
      },
    ],
    recentOrders: [
      {
        id: 2,
        orderNo: 'ORD202605240002',
        amount: 178.0,
        status: 'pending_ship',
        createdAt: '2026-05-18 14:20:00',
      },
    ],
    pointLogs: [
      { id: 4, change: 178, source: '订单消费赠送', createdAt: '2026-05-18 14:21:30' },
      { id: 5, change: 500, source: '新用户注册奖励', createdAt: '2025-11-02 14:30:00' },
    ],
  },
  {
    id: 3,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    nickname: '王五',
    phone: '13700137003',
    level: 'diamond',
    points: 8920,
    orderCount: 28,
    totalSpent: 25680.0,
    createdAt: '2024-06-20 11:00:00',
    status: 'active',
    lastOrderAt: '2026-05-10 16:45:00',
    addresses: [
      {
        id: 4,
        receiver: '王五',
        phone: '13700137003',
        address: '广州市天河区珠江新城花城大道 85 号 高德置地春广场',
        isDefault: true,
      },
    ],
    recentOrders: [
      {
        id: 3,
        orderNo: 'ORD202605240003',
        amount: 199.0,
        status: 'completed',
        createdAt: '2026-05-10 16:45:00',
      },
    ],
    pointLogs: [
      { id: 6, change: 199, source: '订单消费赠送', createdAt: '2026-05-10 16:46:20' },
      { id: 7, change: 1000, source: '会员等级升级奖励', createdAt: '2026-01-01 00:00:00' },
    ],
  },
  {
    id: 4,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    nickname: '赵六',
    phone: '13600136004',
    level: 'normal',
    points: 120,
    orderCount: 2,
    totalSpent: 256.0,
    createdAt: '2026-03-08 08:15:00',
    status: 'active',
    lastOrderAt: '2026-05-24 09:00:00',
    addresses: [
      {
        id: 5,
        receiver: '赵六',
        phone: '13600136004',
        address: '深圳市南山区科技园南区深南大道 9988 号',
        isDefault: true,
      },
    ],
    recentOrders: [
      {
        id: 4,
        orderNo: 'ORD202605240004',
        amount: 68.0,
        status: 'pending_pay',
        createdAt: '2026-05-24 09:00:00',
      },
    ],
    pointLogs: [
      { id: 8, change: 100, source: '新用户注册奖励', createdAt: '2026-03-08 08:15:00' },
      { id: 9, change: 20, source: '每日签到', createdAt: '2026-05-24 08:00:00' },
    ],
  },
  {
    id: 5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi',
    nickname: '孙七',
    phone: '13500135005',
    level: 'silver',
    points: 680,
    orderCount: 4,
    totalSpent: 1580.0,
    createdAt: '2025-12-20 16:40:00',
    status: 'disabled',
    lastOrderAt: '2026-05-15 11:30:00',
    addresses: [
      {
        id: 6,
        receiver: '孙七',
        phone: '13500135005',
        address: '杭州市西湖区文三路 478 号华星时代广场',
        isDefault: true,
      },
    ],
    recentOrders: [
      {
        id: 5,
        orderNo: 'ORD202605240005',
        amount: 158.0,
        status: 'closed',
        createdAt: '2026-05-15 11:30:00',
      },
    ],
    pointLogs: [
      { id: 10, change: 158, source: '订单消费赠送', createdAt: '2026-05-15 11:31:00' },
      { id: 11, change: -158, source: '退款扣回积分', createdAt: '2026-05-16 08:20:00' },
    ],
  },
  {
    id: 6,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhouba',
    nickname: '周八',
    phone: '13400134006',
    level: 'gold',
    points: 2100,
    orderCount: 8,
    totalSpent: 5680.0,
    createdAt: '2025-09-10 20:00:00',
    status: 'active',
    lastOrderAt: '2026-05-12 20:15:00',
    addresses: [
      {
        id: 7,
        receiver: '周八',
        phone: '13400134006',
        address: '成都市武侯区天府大道北段 1700 号环球中心',
        isDefault: true,
      },
    ],
    recentOrders: [
      {
        id: 6,
        orderNo: 'ORD202605240006',
        amount: 588.0,
        status: 'closed',
        createdAt: '2026-05-12 20:15:00',
      },
    ],
    pointLogs: [
      { id: 12, change: 588, source: '订单消费赠送', createdAt: '2026-05-12 20:16:00' },
      { id: 13, change: 300, source: '活动奖励', createdAt: '2026-04-01 10:00:00' },
    ],
  },
];

let memberStore: MemberDetail[] = mockMemberDetails.map((item) => ({ ...item }));

function toMemberItem(detail: MemberDetail): MemberItem {
  const {
    lastOrderAt: _lastOrderAt,
    addresses: _addresses,
    recentOrders: _recentOrders,
    pointLogs: _pointLogs,
    ...item
  } = detail;
  return item;
}

export function filterMockMembers(params: MemberListParams) {
  const { page, pageSize, nickname, phone, level, startTime, endTime } = params;

  let filtered = memberStore.map(toMemberItem);

  if (nickname) {
    filtered = filtered.filter((item) => item.nickname.includes(nickname));
  }

  if (phone) {
    filtered = filtered.filter((item) => item.phone.includes(phone));
  }

  if (level) {
    filtered = filtered.filter((item) => item.level === level);
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

export function getMockMemberDetail(id: number): MemberDetail | null {
  const detail = memberStore.find((item) => item.id === id);
  return detail ? { ...detail } : null;
}

export function mockUpdateMember(
  id: number,
  data: { nickname: string; phone: string; level: MemberDetail['level'] }
): boolean {
  const index = memberStore.findIndex((item) => item.id === id);
  if (index === -1) return false;

  memberStore[index] = {
    ...memberStore[index],
    ...data,
  };

  return true;
}

export function mockUpdateMemberStatus(id: number, status: MemberStatus): boolean {
  const index = memberStore.findIndex((item) => item.id === id);
  if (index === -1) return false;

  memberStore[index] = {
    ...memberStore[index],
    status,
  };

  return true;
}

export const mockMembers = memberStore.map(toMemberItem);
