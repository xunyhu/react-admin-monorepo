import { query } from '../db';

export type MemberLevel = 'normal' | 'silver' | 'gold' | 'diamond';
export type MemberStatus = 'active' | 'disabled';

export interface MemberRow {
  id: number;
  avatar: string | null;
  nickname: string;
  phone: string;
  level: MemberLevel;
  points: number;
  order_count: number;
  total_spent: number;
  status: MemberStatus;
  created_at: string | Date;
}

export interface MemberAddressRow {
  id: number;
  member_id: number;
  receiver: string;
  phone: string;
  address: string;
  is_default: number;
}

export interface MemberPointLogRow {
  id: number;
  member_id: number;
  change_amount: number;
  source: string;
  created_at: string | Date;
}

export interface MemberOrderRow {
  id: number;
  order_no: string;
  total_amount: number;
  order_status: string;
  created_at: string | Date;
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

export interface UpdateMemberPayload {
  nickname: string;
  phone: string;
  level: MemberLevel;
}

function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function mapMemberRow(row: MemberRow) {
  return {
    id: row.id,
    avatar: row.avatar || '',
    nickname: row.nickname,
    phone: row.phone,
    level: row.level,
    points: row.points,
    orderCount: row.order_count,
    totalSpent: Number(row.total_spent),
    createdAt: formatDateTime(row.created_at) || '',
    status: row.status,
  };
}

export const MemberModel = {
  async findList(params: MemberListParams) {
    const { page, pageSize, nickname, phone, level, startTime, endTime } = params;
    const offset = (page - 1) * pageSize;

    let where = 'WHERE 1=1';
    const values: Array<string | number> = [];

    if (nickname) {
      where += ' AND nickname LIKE ?';
      values.push(`%${nickname}%`);
    }

    if (phone) {
      where += ' AND phone LIKE ?';
      values.push(`%${phone}%`);
    }

    if (level) {
      where += ' AND level = ?';
      values.push(level);
    }

    if (startTime) {
      where += ' AND created_at >= ?';
      values.push(`${startTime} 00:00:00`);
    }

    if (endTime) {
      where += ' AND created_at <= ?';
      values.push(`${endTime} 23:59:59`);
    }

    const rows = await query<MemberRow[]>(
      `
      SELECT
        id, avatar, nickname, phone, level, points,
        order_count, total_spent, status, created_at
      FROM members
      ${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [...values, pageSize, offset]
    );

    const totalResult = await query<Array<{ total: number }>>(
      `
      SELECT COUNT(*) AS total
      FROM members
      ${where}
      `,
      values
    );

    return {
      list: rows.map(mapMemberRow),
      total: totalResult[0]?.total ?? 0,
    };
  },

  async findById(id: number) {
    const rows = await query<MemberRow[]>(
      `
      SELECT
        id, avatar, nickname, phone, level, points,
        order_count, total_spent, status, created_at
      FROM members
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    const row = rows[0];
    if (!row) return null;

    const addresses = await query<MemberAddressRow[]>(
      `
      SELECT id, member_id, receiver, phone, address, is_default
      FROM member_addresses
      WHERE member_id = ?
      ORDER BY is_default DESC, id ASC
      `,
      [id]
    );

    const pointLogs = await query<MemberPointLogRow[]>(
      `
      SELECT id, member_id, change_amount, source, created_at
      FROM member_point_logs
      WHERE member_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT 20
      `,
      [id]
    );

    const recentOrders = await query<MemberOrderRow[]>(
      `
      SELECT id, order_no, total_amount, order_status, created_at
      FROM orders
      WHERE user_phone = ?
      ORDER BY created_at DESC, id DESC
      LIMIT 5
      `,
      [row.phone]
    );

    const lastOrderAt = recentOrders[0]
      ? formatDateTime(recentOrders[0].created_at)
      : undefined;

    return {
      ...mapMemberRow(row),
      lastOrderAt,
      addresses: addresses.map((item) => ({
        id: item.id,
        receiver: item.receiver,
        phone: item.phone,
        address: item.address,
        isDefault: item.is_default === 1,
      })),
      recentOrders: recentOrders.map((item) => ({
        id: item.id,
        orderNo: item.order_no,
        amount: Number(item.total_amount),
        status: item.order_status,
        createdAt: formatDateTime(item.created_at) || '',
      })),
      pointLogs: pointLogs.map((item) => ({
        id: item.id,
        change: item.change_amount,
        source: item.source,
        createdAt: formatDateTime(item.created_at) || '',
      })),
    };
  },

  async update(id: number, payload: UpdateMemberPayload) {
    const member = await this.findById(id);

    if (!member) {
      throw Object.assign(new Error('会员不存在'), { status: 404 });
    }

    await query(
      `
      UPDATE members
      SET nickname = ?, phone = ?, level = ?
      WHERE id = ?
      `,
      [payload.nickname, payload.phone, payload.level, id]
    );
  },

  async updateStatus(id: number, status: MemberStatus) {
    const member = await this.findById(id);

    if (!member) {
      throw Object.assign(new Error('会员不存在'), { status: 404 });
    }

    await query(
      `
      UPDATE members
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );
  },
};
