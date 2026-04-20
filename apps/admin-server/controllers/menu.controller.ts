import { Request, Response } from 'express';
import { MenuService } from '../services/menu.service';

export const getMenus = async (req: Request, res: Response) => {
  const data = await MenuService.getAll();
  res.json({
    code: 200,
    data,
  });
};

export const getMenuTree = async (req: Request, res: Response) => {
  const data = await MenuService.getTree();

  res.json({
    code: 200,
    data,
  });
};

export const createMenu = async (req: Request, res: Response) => {
  await MenuService.createMenu(req.body);

  res.json({
    code: 200,
    message: 'created',
  });
};

export const updateMenu = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await MenuService.updateMenu(id, req.body);

  res.json({
    code: 200,
    message: 'updated',
  });
};

export const deleteMenu = async (req: Request, res: Response) => {
  const rawIds = (req.body as any)?.ids;
  const fromBodyIds: number[] = Array.isArray(rawIds)
    ? rawIds.map((x) => Number(x)).filter((x) => Number.isFinite(x))
    : [];

  const idParam = req.params.id;
  const fromParamId = idParam !== undefined ? Number(idParam) : undefined;

  const ids =
    fromBodyIds.length > 0
      ? fromBodyIds
      : Number.isFinite(fromParamId)
        ? [fromParamId as number]
        : [];

  await MenuService.deleteMenus(ids);

  res.json({
    code: 200,
    message: 'deleted',
  });
};
