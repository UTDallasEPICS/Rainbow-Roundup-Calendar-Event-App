FROM node:current-alpine AS builder
COPY . ./
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm add -g pnpm

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm run build

FROM node:current-alpine AS deployment

COPY --from=builder /.output /
# COPY --from=builder /prisma/client /prisma/client
EXPOSE 3000
CMD ["node", "./server/index.mjs"]