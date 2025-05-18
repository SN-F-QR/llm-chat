FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml ./
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY frontend/ ./
RUN pnpm build

FROM base AS production
WORKDIR /app/backend
COPY --from=builder /app/dist ./static
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY  backend/ ./
EXPOSE 3001
CMD [ "pnpm", "start" ]

