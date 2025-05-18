FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=frontend
COPY . .
RUN pnpm run build:frontend

FROM base AS production
WORKDIR /app/backend
COPY --from=builder /app/frontend/dist ./static
COPY --from=builder /app/backend/ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
EXPOSE 3001
CMD [ "pnpm", "start" ]

