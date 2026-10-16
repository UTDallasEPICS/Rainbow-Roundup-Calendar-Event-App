-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AbstractItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "pickupAvailable" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_AbstractItem" ("description", "id", "isArchived", "name", "price") SELECT "description", "id", "isArchived", "name", "price" FROM "AbstractItem";
DROP TABLE "AbstractItem";
ALTER TABLE "new_AbstractItem" RENAME TO "AbstractItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
