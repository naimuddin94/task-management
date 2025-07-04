FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN pnpm install --frozen-lockfile

EXPOSE 5000

COPY . .

CMD [ "pnpm", "dev" ]
