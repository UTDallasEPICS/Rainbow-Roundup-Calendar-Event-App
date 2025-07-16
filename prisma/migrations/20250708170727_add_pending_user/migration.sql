-- CreateTable
CREATE TABLE "PendingUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phoneNum" TEXT,
    "profilePic" TEXT,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_email_key" ON "PendingUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_token_key" ON "PendingUser"("token");
