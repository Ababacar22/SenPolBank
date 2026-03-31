-- AlterTable
ALTER TABLE "fraud_reports" ADD COLUMN     "police_note" TEXT,
ADD COLUMN     "rejection_reason" TEXT,
ADD COLUMN     "validated_at" TIMESTAMP(3);
