/*
  Warnings:

  - You are about to drop the column `accountId` on the `Account` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "balance" REAL NOT NULL
);
INSERT INTO "new_Account" ("balance", "id") SELECT "balance", "id" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
