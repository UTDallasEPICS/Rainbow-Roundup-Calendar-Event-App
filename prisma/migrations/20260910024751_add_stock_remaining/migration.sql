-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ItemVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "size" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT false,
    "stockRemaining" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ItemVariant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AbstractItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ItemVariant" ("availability", "id", "itemId", "size") SELECT "availability", "id", "itemId", "size" FROM "ItemVariant";
DROP TABLE "ItemVariant";
ALTER TABLE "new_ItemVariant" RENAME TO "ItemVariant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
