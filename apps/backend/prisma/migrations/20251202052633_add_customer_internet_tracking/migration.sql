/*
  Warnings:

  - A unique constraint covering the columns `[internetNumber]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "installationDate" TIMESTAMP(3),
ADD COLUMN     "installedModem" TEXT,
ADD COLUMN     "internetNumber" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "modemSerial" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customers_internetNumber_key" ON "customers"("internetNumber");
