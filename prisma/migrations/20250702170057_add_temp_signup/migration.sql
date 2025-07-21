-- CreateTable
CREATE TABLE "TempSignup" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "phoneNum" TEXT,
    "profilePic" TEXT,
    "GlobalNotif" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
