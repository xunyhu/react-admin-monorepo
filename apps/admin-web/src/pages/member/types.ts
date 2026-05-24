export type MemberLevel = 'normal' | 'silver' | 'gold' | 'diamond';

export type MemberStatus = 'active' | 'disabled';

export interface MemberItem {
  id: number;
  avatar: string;
  nickname: string;
  phone: string;
  level: MemberLevel;
  points: number;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  status: MemberStatus;
}

export interface MemberAddress {
  id: number;
  receiver: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface MemberOrder {
  id: number;
  orderNo: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface MemberPointLog {
  id: number;
  change: number;
  source: string;
  createdAt: string;
}

export interface MemberDetail extends MemberItem {
  lastOrderAt?: string;
  addresses: MemberAddress[];
  recentOrders: MemberOrder[];
  pointLogs: MemberPointLog[];
}

export interface MemberListParams {
  page: number;
  pageSize: number;
  nickname?: string;
  phone?: string;
  level?: MemberLevel;
  startTime?: string;
  endTime?: string;
}

export interface MemberListResult {
  list: MemberItem[];
  total: number;
}

export interface MemberSearchValues {
  nickname?: string;
  phone?: string;
  level?: MemberLevel;
  dateRange?: [string, string];
}

export interface MemberFormValues {
  nickname: string;
  phone: string;
  level: MemberLevel;
}

export interface UpdateMemberStatusPayload {
  status: MemberStatus;
}

export const MEMBER_LEVEL_OPTIONS = [
  { label: '普通会员', value: 'normal' as MemberLevel },
  { label: '白银会员', value: 'silver' as MemberLevel },
  { label: '黄金会员', value: 'gold' as MemberLevel },
  { label: '钻石会员', value: 'diamond' as MemberLevel },
];

export const MEMBER_STATUS_OPTIONS = [
  { label: '正常', value: 'active' as MemberStatus },
  { label: '已禁用', value: 'disabled' as MemberStatus },
];

export const MEMBER_LEVEL_MAP: Record<MemberLevel, string> = {
  normal: '普通会员',
  silver: '白银会员',
  gold: '黄金会员',
  diamond: '钻石会员',
};

export const MEMBER_STATUS_MAP: Record<MemberStatus, string> = {
  active: '正常',
  disabled: '已禁用',
};
