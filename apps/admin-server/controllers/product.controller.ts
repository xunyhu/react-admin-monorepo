import { Request, Response } from 'express';
import productService from '../services/product.service';

export async function getProductList(req: Request, res: Response) {
  const { page = 1, pageSize = 10, name, category, status } = req.query;

  const data = await productService.getProductList({
    page: Number(page),
    pageSize: Number(pageSize),
    name: name ? String(name) : undefined,
    category: category ? String(category) : undefined,
    status: status !== undefined ? Number(status) : undefined,
  });

  res.json({
    code: 200,
    message: 'success',
    data,
  });
}

export async function createProduct(req: Request, res: Response) {
  const id = await productService.createProduct(req.body);

  res.json({
    code: 200,
    message: '创建成功',
    data: { id },
  });
}

export async function updateProduct(req: Request, res: Response) {
  const id = Number(req.params.id);

  await productService.updateProduct(id, req.body);

  res.json({
    code: 200,
    message: '更新成功',
  });
}

export async function deleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);

  await productService.deleteProduct(id);

  res.json({
    code: 200,
    message: '删除成功',
  });
}
