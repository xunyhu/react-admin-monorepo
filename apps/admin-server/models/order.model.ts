import { query } from '../db';

export type PayStatus = 'pending' | 'paid' | 'refunded';
export type ShippingStatus = 'pending' | 'shipped' | 'received';
export type OrderStatus = 'pending_pay' | 'pending_ship' | 'completed' | 'closed';
export type OrderLogType = 'created' | 'paid' | 'shipped' | 'received';

export interface OrderRow {
  id: number;
  order_no: string;
  user_avatar: string | null;
  user_nickname: string;
  user_phone: string;
  receiver: string;
  receiver_phone: string;
  address: string;
  product_total: number;
  freight: number;
  discount: number;
  paid_amount: number;
  total_amount: number;
  product_count: number;
  pay_status: PayStatus;
  shipping_status: ShippingStatus;
  order_status: OrderStatus;
  created_at: string | Date;
  paid_at: string | Date | null;
}

export interface OrderItemRow {
  id: number;
  order_id: number;
  product_id: number | null;
  image: string | null;
  name: string;
  sku: string | null;
  price: number;
  quantity: number;
}

export interface OrderLogRow {
  id: number;
  order_id: number;
  type: OrderLogType;
  content: string;
  created_at: string | Date;
}

export interface OrderListParams {
  page: number;
  pageSize: number;
  orderNo?: string;
  nickname?: string;
  phone?: string;
  payStatus?: PayStatus;
  shippingStatus?: ShippingStatus;
  startTime?: string;
  endTime?: string;
}

function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function mapOrderRow(row: OrderRow, items: OrderItemRow[]) {
  return {
    id: row.id,
    orderNo: row.order_no,
    user: {
      avatar: row.user_avatar || '',
      nickname: row.user_nickname,
      phone: row.user_phone,
    },
    products: items.map((item) => ({
      id: item.id,
      image: item.image || '',
      name: item.name,
      sku: item.sku || '',
      price: Number(item.price),
      quantity: item.quantity,
    })),
    totalAmount: Number(row.total_amount),
    productCount: row.product_count,
    payStatus: row.pay_status,
    shippingStatus: row.shipping_status,
    orderStatus: row.order_status,
    createdAt: formatDateTime(row.created_at) || '',
  };
}

async function findItemsByOrderIds(orderIds: number[]) {
  if (orderIds.length === 0) return new Map<number, OrderItemRow[]>();

  const placeholders = orderIds.map(() => '?').join(', ');
  const items = await query<OrderItemRow[]>(
    `
    SELECT id, order_id, product_id, image, name, sku, price, quantity
    FROM order_items
    WHERE order_id IN (${placeholders})
    ORDER BY id ASC
    `,
    orderIds
  );

  const map = new Map<number, OrderItemRow[]>();

  items.forEach((item) => {
    const list = map.get(item.order_id) || [];
    list.push(item);
    map.set(item.order_id, list);
  });

  return map;
}

export const OrderModel = {
  async findList(params: OrderListParams) {
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
    const offset = (page - 1) * pageSize;

    let where = 'WHERE 1=1';
    const values: Array<string | number> = [];

    if (orderNo) {
      where += ' AND order_no LIKE ?';
      values.push(`%${orderNo}%`);
    }

    if (nickname) {
      where += ' AND user_nickname LIKE ?';
      values.push(`%${nickname}%`);
    }

    if (phone) {
      where += ' AND user_phone LIKE ?';
      values.push(`%${phone}%`);
    }

    if (payStatus) {
      where += ' AND pay_status = ?';
      values.push(payStatus);
    }

    if (shippingStatus) {
      where += ' AND shipping_status = ?';
      values.push(shippingStatus);
    }

    if (startTime) {
      where += ' AND created_at >= ?';
      values.push(`${startTime} 00:00:00`);
    }

    if (endTime) {
      where += ' AND created_at <= ?';
      values.push(`${endTime} 23:59:59`);
    }

    const rows = await query<OrderRow[]>(
      `
      SELECT
        id, order_no, user_avatar, user_nickname, user_phone,
        receiver, receiver_phone, address,
        product_total, freight, discount, paid_amount, total_amount, product_count,
        pay_status, shipping_status, order_status, created_at, paid_at
      FROM orders
      ${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [...values, pageSize, offset]
    );

    const totalResult = await query<Array<{ total: number }>>(
      `
      SELECT COUNT(*) AS total
      FROM orders
      ${where}
      `,
      values
    );

    const orderIds = rows.map((row) => row.id);
    const itemsMap = await findItemsByOrderIds(orderIds);

    return {
      list: rows.map((row) => mapOrderRow(row, itemsMap.get(row.id) || [])),
      total: totalResult[0]?.total ?? 0,
    };
  },

  async findById(id: number) {
    const rows = await query<OrderRow[]>(
      `
      SELECT
        id, order_no, user_avatar, user_nickname, user_phone,
        receiver, receiver_phone, address,
        product_total, freight, discount, paid_amount, total_amount, product_count,
        pay_status, shipping_status, order_status, created_at, paid_at
      FROM orders
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    const row = rows[0];
    if (!row) return null;

    const items = await query<OrderItemRow[]>(
      `
      SELECT id, order_id, product_id, image, name, sku, price, quantity
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
      `,
      [id]
    );

    const logs = await query<OrderLogRow[]>(
      `
      SELECT id, order_id, type, content, created_at
      FROM order_logs
      WHERE order_id = ?
      ORDER BY created_at ASC, id ASC
      `,
      [id]
    );

    const base = mapOrderRow(row, items);

    return {
      ...base,
      paidAt: formatDateTime(row.paid_at),
      address: {
        receiver: row.receiver,
        phone: row.receiver_phone,
        address: row.address,
      },
      amount: {
        productTotal: Number(row.product_total),
        freight: Number(row.freight),
        discount: Number(row.discount),
        paidAmount: Number(row.paid_amount),
      },
      logs: logs.map((log) => ({
        type: log.type,
        content: log.content,
        time: formatDateTime(log.created_at) || '',
      })),
    };
  },

  async ship(id: number) {
    const order = await this.findById(id);

    if (!order) {
      throw Object.assign(new Error('订单不存在'), { status: 404 });
    }

    if (
      order.payStatus !== 'paid' ||
      order.shippingStatus !== 'pending' ||
      order.orderStatus === 'closed'
    ) {
      throw Object.assign(new Error('发货失败，请确认订单状态'), { status: 400 });
    }

    await query(
      `
      UPDATE orders
      SET shipping_status = 'shipped'
      WHERE id = ?
      `,
      [id]
    );

    const trackingNo = `SF${Date.now().toString().slice(-10)}`;

    await query(
      `
      INSERT INTO order_logs (order_id, type, content)
      VALUES (?, 'shipped', ?)
      `,
      [id, `商家已发货，顺丰速运 ${trackingNo}`]
    );
  },

  async close(id: number) {
    const order = await this.findById(id);

    if (!order) {
      throw Object.assign(new Error('订单不存在'), { status: 404 });
    }

    if (order.orderStatus === 'completed' || order.orderStatus === 'closed') {
      throw Object.assign(new Error('关闭失败，请确认订单状态'), { status: 400 });
    }

    await query(
      `
      UPDATE orders
      SET order_status = 'closed'
      WHERE id = ?
      `,
      [id]
    );

    await query(
      `
      INSERT INTO order_logs (order_id, type, content)
      VALUES (?, 'created', '商家关闭订单')
      `,
      [id]
    );
  },

  async delete(id: number) {
    const order = await this.findById(id);

    if (!order) {
      throw Object.assign(new Error('订单不存在'), { status: 404 });
    }

    await query(`DELETE FROM orders WHERE id = ?`, [id]);
  },
};
