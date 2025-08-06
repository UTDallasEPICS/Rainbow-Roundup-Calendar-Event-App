/*
  Warnings:

  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShippingInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `itemConfigId` on the `ItemPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `ItemPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `shippingInfoId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `itemConfigId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `priceAtOrder` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `ItemPhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `ItemPhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finishedItemsId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Announcement_userId_eventId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Announcement";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CartItem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ItemConfig";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ShippingInfo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FinishedItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "FinishedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "ItemPhoto_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemPhoto" ("id") SELECT "id" FROM "ItemPhoto";
DROP TABLE "ItemPhoto";
ALTER TABLE "new_ItemPhoto" RENAME TO "ItemPhoto";
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paymentInfo" TEXT,
    "placedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("id", "paymentInfo", "placedAt", "status", "updatedAt", "userId") SELECT "id", "paymentInfo", "placedAt", "status", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "finishedItemsId" TEXT NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_finishedItemsId_fkey" FOREIGN KEY ("finishedItemsId") REFERENCES "FinishedItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "orderId") SELECT "id", "orderId" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
