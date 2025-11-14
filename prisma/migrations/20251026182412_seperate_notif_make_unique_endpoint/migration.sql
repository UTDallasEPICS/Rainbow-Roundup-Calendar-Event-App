/*
  Warnings:

  - You are about to drop the column `GlobalNotif` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[endpoint]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "phoneNum" TEXT,
    "profilePic" TEXT NOT NULL DEFAULT '/default-profile.png',
    "EmailNotif" BOOLEAN NOT NULL DEFAULT false,
    "NativeNotif" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" DATETIME
);
INSERT INTO "new_User" ("email", "emailVerified", "firstname", "id", "lastname", "phoneNum", "profilePic", "role") SELECT "email", "emailVerified", "firstname", "id", "lastname", "phoneNum", "profilePic", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNum_key" ON "User"("phoneNum");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_endpoint_key" ON "Notification"("endpoint");
