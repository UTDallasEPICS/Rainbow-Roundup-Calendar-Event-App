/*
  Warnings:

  - You are about to drop the column `price` on the `AbstractItem` table. All the data in the column will be lost.
  - Added the required column `priceCents` to the `AbstractItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceDollars` to the `AbstractItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AbstractItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priceDollars" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_AbstractItem"
("description", "id", "isArchived", "name", "priceDollars", "priceCents")
SELECT "description", "id", "isArchived", "name", 0, 0
FROM "AbstractItem";
DROP TABLE "AbstractItem";
ALTER TABLE "new_AbstractItem" RENAME TO "AbstractItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
