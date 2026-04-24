import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import roleRoutes from './routes/role.routes';
import menuRoutes from './routes/menu.routes';
import designRoutes from './routes/design.routes';

import { authMiddleware } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
const corsOrigin = process.env.CORS_ORIGIN;

// 基础中间件
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use(
  cors({
    origin: corsOrigin
      ? corsOrigin.split(',').map((item) => item.trim())
      : true,
    credentials: true,
  })
);
app.use(express.json());

// 公共路由（无需登录）
app.use('/api', authRoutes);
app.use('/api/design', designRoutes);

// 鉴权中间件（必须登录）
app.use(authMiddleware);

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/menus', menuRoutes);

// 错误处理
app.use(errorMiddleware);

export default app;
