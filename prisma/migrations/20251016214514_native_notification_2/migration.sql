/*
  Warnings:

  - You are about to drop the column `auth` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `p256df` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `keys` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint" TEXT NOT NULL,
    "keys" JSONB NOT NULL
);
INSERT INTO "new_Notification" ("endpoint", "id") SELECT "endpoint", "id" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
