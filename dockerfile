FROM node:22-alpine AS builder
COPY . ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm i --force
RUN npx prisma generate
RUN ls /prisma/client
RUN pnpm run build

FROM node:22-alpine AS deployment

COPY --from=builder /.output /
COPY --from=builder /prisma/client /prisma/client
EXPOSE 3000
CMD ["node", "./server/index.mjs"]