FROM node:22-alpine AS builder
COPY . ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm i --shamefully-hoist --force
RUN pnpm exec prisma generate
# RUN ls /prisma/client
RUN pnpm run build

FROM node:22-alpine AS deployment

COPY --from=builder /.output /
COPY --from=builder /prisma /prisma

# Install prisma client in container to initialize the db
# Note: I am intentionally using an old version of prisma since version 7 is not compatible with our code as of writing this
RUN npm i -g prisma@^6.19.0
# This will build the image but to initialize it, when you run the actual container, you have to run
#    prisma migrate deploy 
# The command needs to be run within the container. It cannot be done here since the build script cannot access the env and we use the .env in schema.prisma

# COPY --from=builder /prisma/client /prisma/client
EXPOSE 3000
CMD ["node", "./server/index.mjs"]