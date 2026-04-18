import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'admin_secret_key';

export const signToken = (payload: any) => {
  return jwt.sign(payload, SECRET, { expiresIn: '2h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
