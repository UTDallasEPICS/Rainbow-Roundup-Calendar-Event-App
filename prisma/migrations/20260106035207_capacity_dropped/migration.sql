/*
  Warnings:

  - You are about to drop the column `currentCapacity` on the `Event` table. All the data in the column will be lost.

*/
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
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("capacity", "description", "endTime", "eventLat", "eventLong", "id", "isArchived", "location", "startTime", "title", "userId") SELECT "capacity", "description", "endTime", "eventLat", "eventLong", "id", "isArchived", "location", "startTime", "title", "userId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
