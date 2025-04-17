/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `adminId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `sendNotification` on the `SignUp` table. All the data in the column will be lost.
  - Added the required column `eventLat` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventLong` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Admin_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Admin";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportedUserId" TEXT NOT NULL,
    "reporterUserId" TEXT NOT NULL,
    "isUsername" BOOLEAN NOT NULL,
    "isProfilePic" BOOLEAN NOT NULL,
    "isOther" BOOLEAN NOT NULL,
    "description" TEXT,
    "reportTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "eventLat" REAL NOT NULL,
    "eventLong" REAL NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "capacity" INTEGER,
    "currentCapacity" INTEGER,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("capacity", "date", "description", "endTime", "id", "startTime") SELECT "capacity", "date", "description", "endTime", "id", "startTime" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_SignUp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "SignUp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SignUp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SignUp" ("eventId", "id", "userId") SELECT "eventId", "id", "userId" FROM "SignUp";
DROP TABLE "SignUp";
ALTER TABLE "new_SignUp" RENAME TO "SignUp";
CREATE UNIQUE INDEX "SignUp_userId_eventId_key" ON "SignUp"("userId", "eventId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "phoneNum" TEXT,
    "profilePic" TEXT
);
INSERT INTO "new_User" ("email", "firstname", "id", "lastname", "phoneNum", "profilePic") SELECT "email", "firstname", "id", "lastname", "phoneNum", "profilePic" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_eventId_key" ON "Notification"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reportedUserId_reporterUserId_key" ON "Report"("reportedUserId", "reporterUserId");
