/*
  Warnings:

  - You are about to drop the column `availbility` on the `ItemVariant` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "size" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ItemVariant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AbstractItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemVariant" ("id", "itemId", "size") SELECT "id", "itemId", "size" FROM "ItemVariant";
DROP TABLE "ItemVariant";
ALTER TABLE "new_ItemVariant" RENAME TO "ItemVariant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
