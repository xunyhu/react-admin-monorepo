import { Request, Response } from 'express';
import { PageDesignService } from '../services/pageDesign.service';

function requireString(val: any, msg: string) {
  if (typeof val !== 'string' || !val.trim()) {
    const err = new Error(msg);
    (err as any).status = 400;
    throw err;
  }
  return val.trim();
}

export async function listPageDesigns(req: Request, res: Response) {
  const { page = 1, pageSize = 20, q, status } = req.query as any;

  const data = await PageDesignService.list({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
    q: typeof q === 'string' ? q : undefined,
    status: typeof status === 'string' ? status : undefined,
  });

  res.json({ code: 200, message: 'success', data });
}

export async function getPageDesign(req: Request, res: Response) {
  const id = requireString(req.params.id, 'id required');
  const data = await PageDesignService.getById(id);
  if (!data) {
    return res.status(404).json({ code: 404, message: 'not found', data: null });
  }
  res.json({ code: 200, message: 'success', data });
}

export async function createPageDesign(req: Request, res: Response) {
  const body = req.body || {};
  const name = requireString(body.name, 'name required');

  const userId = (req as any).user?.id;
  const id = await PageDesignService.create({
    name,
    description: typeof body.description === 'string' ? body.description : undefined,
    status: body.status,
    schemaVersion: body.schemaVersion,
    schema: body.schema ?? { blocks: [] },
    createdBy: typeof userId === 'number' ? userId : null,
  });

  res.json({ code: 200, message: 'created', data: { id } });
}

export async function updatePageDesign(req: Request, res: Response) {
  const id = requireString(req.params.id, 'id required');
  const body = req.body || {};
  const name = requireString(body.name, 'name required');

  const userId = (req as any).user?.id;
  await PageDesignService.update(id, {
    name,
    description: typeof body.description === 'string' ? body.description : undefined,
    status: body.status,
    schemaVersion: body.schemaVersion,
    schema: body.schema ?? { blocks: [] },
    updatedBy: typeof userId === 'number' ? userId : null,
  });

  res.json({ code: 200, message: 'updated' });
}

export async function deletePageDesign(req: Request, res: Response) {
  const id = requireString(req.params.id, 'id required');
  await PageDesignService.remove(id);
  res.json({ code: 200, message: 'deleted' });
}

