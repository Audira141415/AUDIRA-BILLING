/*
  Warnings:

  - You are about to drop the column `method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentNumber` on the `payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "payments_paymentNumber_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "method",
DROP COLUMN "paymentNumber",
ADD COLUMN     "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "transactionId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'success';
