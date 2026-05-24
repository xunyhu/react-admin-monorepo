import { Request, Response } from 'express';
import orderService from '../services/order.service';
import type { PayStatus, ShippingStatus } from '../models/order.model';

export async function getOrderList(req: Request, res: Response) {
  const {
    page = 1,
    pageSize = 10,
    orderNo,
    nickname,
    phone,
    payStatus,
    shippingStatus,
    startTime,
    endTime,
  } = req.query;

  const data = await orderService.getOrderList({
    page: Number(page),
    pageSize: Number(pageSize),
    orderNo: orderNo ? String(orderNo) : undefined,
    nickname: nickname ? String(nickname) : undefined,
    phone: phone ? String(phone) : undefined,
    payStatus: payStatus ? (String(payStatus) as PayStatus) : undefined,
    shippingStatus: shippingStatus
      ? (String(shippingStatus) as ShippingStatus)
      : undefined,
    startTime: startTime ? String(startTime) : undefined,
    endTime: endTime ? String(endTime) : undefined,
  });

  res.json({
    code: 200,
    message: 'success',
    data,
  });
}

export async function getOrderDetail(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await orderService.getOrderDetail(id);

  res.json({
    code: 200,
    message: 'success',
    data,
  });
}

export async function shipOrder(req: Request, res: Response) {
  const id = Number(req.params.id);

  await orderService.shipOrder(id);

  res.json({
    code: 200,
    message: '发货成功',
  });
}

export async function closeOrder(req: Request, res: Response) {
  const id = Number(req.params.id);

  await orderService.closeOrder(id);

  res.json({
    code: 200,
    message: '订单已关闭',
  });
}

export async function deleteOrder(req: Request, res: Response) {
  const id = Number(req.params.id);

  await orderService.deleteOrder(id);

  res.json({
    code: 200,
    message: '删除成功',
  });
}
