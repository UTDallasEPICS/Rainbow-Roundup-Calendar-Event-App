/*
  Warnings:

  - You are about to alter the column `emailVerified` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "phoneNum" TEXT,
    "image" TEXT NOT NULL DEFAULT '/default-profile.png',
    "GlobalNotif" BOOLEAN NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_user" ("GlobalNotif", "createdAt", "email", "emailVerified", "id", "image", "lastname", "name", "phoneNum", "role", "updatedAt") SELECT "GlobalNotif", "createdAt", "email", coalesce("emailVerified", false) AS "emailVerified", "id", "image", "lastname", "name", "phoneNum", "role", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE UNIQUE INDEX "user_phoneNum_key" ON "user"("phoneNum");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
