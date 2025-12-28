FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

FROM base AS dev-deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM dev-deps AS prisma
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY .env ./
RUN bunx prisma generate

FROM base AS runner
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy Prisma client package
COPY --from=prisma /app/node_modules/@prisma ./node_modules/@prisma

# Copy generated Prisma client
COPY --from=prisma /app/generated ./generated

# Copy application code
COPY . .

# Expose port
EXPOSE 4000

# Run the application
CMD ["bun", "run", "start"]
