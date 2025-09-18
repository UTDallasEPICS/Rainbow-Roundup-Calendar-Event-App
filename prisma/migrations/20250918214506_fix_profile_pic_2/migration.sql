-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PendingUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phoneNum" TEXT,
    "profilePic" TEXT NOT NULL DEFAULT '/default-profile.png',
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PendingUser" ("email", "expires", "firstname", "id", "lastname", "phoneNum", "profilePic", "token") SELECT "email", "expires", "firstname", "id", "lastname", "phoneNum", coalesce("profilePic", '/default-profile.png') AS "profilePic", "token" FROM "PendingUser";
DROP TABLE "PendingUser";
ALTER TABLE "new_PendingUser" RENAME TO "PendingUser";
CREATE UNIQUE INDEX "PendingUser_email_key" ON "PendingUser"("email");
CREATE UNIQUE INDEX "PendingUser_phoneNum_key" ON "PendingUser"("phoneNum");
CREATE UNIQUE INDEX "PendingUser_token_key" ON "PendingUser"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
