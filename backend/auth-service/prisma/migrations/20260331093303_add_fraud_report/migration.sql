-- CreateEnum
CREATE TYPE "FraudStatus" AS ENUM ('PENDING_POLICE', 'PENDING_BANK', 'RESOLVED', 'REJECTED');

-- CreateTable
CREATE TABLE "fraud_reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "bank_account" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "status" "FraudStatus" NOT NULL DEFAULT 'PENDING_POLICE',
    "citizen_id" TEXT NOT NULL,
    "police_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fraud_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fraud_reports" ADD CONSTRAINT "fraud_reports_citizen_id_fkey" FOREIGN KEY ("citizen_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
