/*
  Warnings:

  - You are about to drop the column `food` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `FoodLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."FoodLog" DROP COLUMN "food",
DROP COLUMN "quantity",
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "foodId" TEXT,
ADD COLUMN     "manualCalories" DOUBLE PRECISION,
ADD COLUMN     "manualCarbs" DOUBLE PRECISION,
ADD COLUMN     "manualFat" DOUBLE PRECISION,
ADD COLUMN     "manualName" TEXT,
ADD COLUMN     "manualProtein" DOUBLE PRECISION,
ADD COLUMN     "unit" TEXT;

-- CreateTable
CREATE TABLE "public"."Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "barcode" TEXT,
    "calories" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_barcode_key" ON "public"."Food"("barcode");

-- AddForeignKey
ALTER TABLE "public"."FoodLog" ADD CONSTRAINT "FoodLog_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "public"."Food"("id") ON DELETE SET NULL ON UPDATE CASCADE;
