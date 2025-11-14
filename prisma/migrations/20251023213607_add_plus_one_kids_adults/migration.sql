/*
  Warnings:

  - You are about to drop the `FinishedItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `finishedItemsId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `plusOne` on the `SignUp` table. All the data in the column will be lost.
  - Added the required column `itemVariantId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
CREATE TABLE "new_SignUp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "Notifications" BOOLEAN NOT NULL,
    "plusOneKids" INTEGER NOT NULL DEFAULT 0,
    "plusOneAdults" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SignUp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SignUp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SignUp" ("Notifications", "eventId", "id", "userId") SELECT "Notifications", "eventId", "id", "userId" FROM "SignUp";
DROP TABLE "SignUp";
ALTER TABLE "new_SignUp" RENAME TO "SignUp";
CREATE UNIQUE INDEX "SignUp_userId_eventId_key" ON "SignUp"("userId", "eventId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
