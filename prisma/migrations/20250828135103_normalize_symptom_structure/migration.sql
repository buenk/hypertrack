/*
  Warnings:

  - You are about to drop the `SymptomLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SymptomLog" DROP CONSTRAINT "SymptomLog_userId_fkey";

-- DropTable
DROP TABLE "public"."SymptomLog";

-- CreateTable
CREATE TABLE "public"."Symptom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."symptom_log" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" INTEGER NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,

    CONSTRAINT "symptom_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."symptom_log" ADD CONSTRAINT "symptom_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."symptom_log" ADD CONSTRAINT "symptom_log_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "public"."Symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
