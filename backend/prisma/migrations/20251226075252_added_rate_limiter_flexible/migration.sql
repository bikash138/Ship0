-- CreateTable
CREATE TABLE "RateLimiterFlexible" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimiterFlexible_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RateLimiterFlexible_key_key" ON "RateLimiterFlexible"("key");
