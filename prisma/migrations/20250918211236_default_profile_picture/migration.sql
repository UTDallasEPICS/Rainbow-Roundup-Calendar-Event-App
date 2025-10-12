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
    "GlobalNotif" BOOLEAN NOT NULL,
    "emailVerified" DATETIME
);
INSERT INTO "new_User" ("GlobalNotif", "email", "emailVerified", "firstname", "id", "lastname", "phoneNum", "profilePic", "role") SELECT "GlobalNotif", "email", "emailVerified", "firstname", "id", "lastname", "phoneNum", coalesce("profilePic", '/default-profile.png') AS "profilePic", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
