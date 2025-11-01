/*
  Warnings:

  - You are about to drop the column `keys` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `auth` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p256dh` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL
);
INSERT INTO "new_Notification" ("endpoint", "id") SELECT "endpoint", "id" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
