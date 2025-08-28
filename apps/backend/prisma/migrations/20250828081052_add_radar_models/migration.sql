-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cover" TEXT,
    "supply" INTEGER,
    "owners" INTEGER,
    "floorTon" REAL,
    "volume24hTon" REAL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "animationUrl" TEXT,
    "priceTon" REAL,
    "forSale" BOOLEAN NOT NULL DEFAULT false,
    "lastSaleTon" REAL,
    "collectionId" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trait" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RadarRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemAddress" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME NOT NULL,
    "seedHash" TEXT NOT NULL,
    "serverSeed" TEXT,
    "publicSalt" TEXT,
    "rand" TEXT,
    "winnersJson" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RadarEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roundId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RadarEntry_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "RadarRound" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_address_key" ON "Collection"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Item_address_key" ON "Item"("address");

-- CreateIndex
CREATE INDEX "Trait_itemId_idx" ON "Trait"("itemId");

-- CreateIndex
CREATE INDEX "RadarRound_itemAddress_status_idx" ON "RadarRound"("itemAddress", "status");

-- CreateIndex
CREATE INDEX "RadarEntry_userId_createdAt_idx" ON "RadarEntry"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RadarEntry_roundId_userId_key" ON "RadarEntry"("roundId", "userId");
