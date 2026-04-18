import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    user?:
      | {
          id: number;
          role: string;
        }
      | JwtPayload;
  }
}
