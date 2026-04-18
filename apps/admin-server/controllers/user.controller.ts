import { Request, Response } from 'express';
import userService from '../services/user.service';

export async function getUserList(req: Request, res: Response) {
  const { page = 1, pageSize = 10, username, status } = req.query;

  const data = await userService.getUserList({
    page: Number(page),
    pageSize: Number(pageSize),
    username,
    status: status !== undefined ? Number(status) : undefined,
  });

  res.json({
    code: 200,
    message: 'success',
    data,
  });
}

export async function createUser(req: Request, res: Response) {
  const id = await userService.createUser(req.body);

  res.json({
    code: 200,
    message: '创建成功',
    data: { id },
  });
}

export async function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);

  await userService.updateUser(id, req.body);

  res.json({
    code: 200,
    message: '更新成功',
  });
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);

  await userService.deleteUser(id);

  res.json({
    code: 200,
    message: '删除成功',
  });
}
