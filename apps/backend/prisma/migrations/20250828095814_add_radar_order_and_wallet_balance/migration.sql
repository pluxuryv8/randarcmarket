-- CreateTable
CREATE TABLE "RadarOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemAddress" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "priceTon" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "txHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WalletBalance" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "ton" REAL NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "RadarOrder_userId_status_idx" ON "RadarOrder"("userId", "status");

-- CreateIndex
CREATE INDEX "RadarOrder_reservationId_idx" ON "RadarOrder"("reservationId");
