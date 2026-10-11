-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN "hidden" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Opportunity_hidden_idx" ON "Opportunity"("hidden");
