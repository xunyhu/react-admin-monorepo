FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install
RUN pnpm --filter admin-web build

RUN npm install -g serve

CMD ["serve", "-s", "apps/admin-web/dist", "-l", "80"]