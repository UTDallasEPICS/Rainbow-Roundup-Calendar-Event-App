/*
  Warnings:

  - You are about to drop the column `price` on the `ItemVariant` table. All the data in the column will be lost.
  - Added the required column `price` to the `AbstractItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AbstractItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL
);
INSERT INTO "new_AbstractItem" ("id", "name") SELECT "id", "name" FROM "AbstractItem";
DROP TABLE "AbstractItem";
ALTER TABLE "new_AbstractItem" RENAME TO "AbstractItem";
CREATE TABLE "new_ItemVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "size" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "availbility" BOOLEAN NOT NULL DEFAULT false,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "ItemVariant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AbstractItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemVariant" ("availbility", "description", "id", "itemId", "size") SELECT "availbility", "description", "id", "itemId", "size" FROM "ItemVariant";
DROP TABLE "ItemVariant";
ALTER TABLE "new_ItemVariant" RENAME TO "ItemVariant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
