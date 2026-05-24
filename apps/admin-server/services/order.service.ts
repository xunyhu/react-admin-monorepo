import {
  OrderListParams,
  OrderModel,
} from '../models/order.model';

class OrderService {
  async getOrderList(params: OrderListParams) {
    return OrderModel.findList(params);
  }

  async getOrderDetail(id: number) {
    const detail = await OrderModel.findById(id);

    if (!detail) {
      throw Object.assign(new Error('订单不存在'), { status: 404 });
    }

    return detail;
  }

  async shipOrder(id: number) {
    return OrderModel.ship(id);
  }

  async closeOrder(id: number) {
    return OrderModel.close(id);
  }

  async deleteOrder(id: number) {
    return OrderModel.delete(id);
  }
}

export default new OrderService();
