/*
  Warnings:

  - You are about to drop the `FinishedItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `finishedItemsId` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `itemVariantId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FinishedItem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Item";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ItemVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "size" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "availbility" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ItemVariant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AbstractItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AbstractItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventLat" REAL,
    "eventLong" REAL,
    "location" TEXT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "capacity" INTEGER,
    "currentCapacity" INTEGER,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("capacity", "currentCapacity", "description", "endTime", "eventLat", "eventLong", "id", "location", "startTime", "title", "userId") SELECT "capacity", "currentCapacity", "description", "endTime", "eventLat", "eventLong", "id", "location", "startTime", "title", "userId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_ItemPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "ItemPhoto_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AbstractItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemPhoto" ("id", "itemId", "url") SELECT "id", "itemId", "url" FROM "ItemPhoto";
DROP TABLE "ItemPhoto";
ALTER TABLE "new_ItemPhoto" RENAME TO "ItemPhoto";
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "itemVariantId" TEXT NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_itemVariantId_fkey" FOREIGN KEY ("itemVariantId") REFERENCES "ItemVariant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "orderId") SELECT "id", "orderId" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportedUserId" TEXT NOT NULL,
    "reporterUserId" TEXT NOT NULL,
    "isUsername" BOOLEAN NOT NULL,
    "isProfilePic" BOOLEAN NOT NULL,
    "isOther" BOOLEAN NOT NULL,
    "description" TEXT,
    "reportTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("description", "id", "isOther", "isProfilePic", "isUsername", "reportTime", "reportedUserId", "reporterUserId") SELECT "description", "id", "isOther", "isProfilePic", "isUsername", "reportTime", "reportedUserId", "reporterUserId" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE UNIQUE INDEX "Report_reportedUserId_reporterUserId_key" ON "Report"("reportedUserId", "reporterUserId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "phoneNum" TEXT,
    "profilePic" TEXT NOT NULL DEFAULT '/default-profile.png',
    "GlobalNotif" BOOLEAN NOT NULL,
    "emailVerified" DATETIME,
    "isBanned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("GlobalNotif", "email", "emailVerified", "firstname", "id", "lastname", "phoneNum", "profilePic", "role") SELECT "GlobalNotif", "email", "emailVerified", "firstname", "id", "lastname", "phoneNum", "profilePic", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNum_key" ON "User"("phoneNum");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
