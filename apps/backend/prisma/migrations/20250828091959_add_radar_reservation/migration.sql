-- CreateTable
CREATE TABLE "RadarReservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roundId" TEXT NOT NULL,
    "itemAddress" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "priceTon" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "reserveToken" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "RadarReservation_userId_createdAt_idx" ON "RadarReservation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RadarReservation_itemAddress_status_idx" ON "RadarReservation"("itemAddress", "status");

-- CreateIndex
CREATE INDEX "RadarReservation_roundId_status_idx" ON "RadarReservation"("roundId", "status");
