FROM oven/bun:1

WORKDIR /app

COPY package.json tsconfig.json ./
COPY src ./src

RUN bun install

CMD ["bun", "run", "start"]

