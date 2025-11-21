-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "registrationLink" TEXT NOT NULL
);
