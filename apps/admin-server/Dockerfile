FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm --filter admin-server build

WORKDIR /app/apps/admin-server

EXPOSE 3001

CMD ["node", "dist/server.js"]