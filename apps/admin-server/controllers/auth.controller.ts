import { Request, Response } from 'express';
import authService from '../services/auth.service';

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const data = await authService.login(username, password);

    res.json({
      code: 200,
      data,
    });
  } catch (err: any) {
    res.json({
      code: 500,
      message: err.message,
    });
  }
}
