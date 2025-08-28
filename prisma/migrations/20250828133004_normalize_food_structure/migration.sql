/*
  Warnings:

  - You are about to drop the column `manualCalories` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the column `manualCarbs` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the column `manualFat` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the column `manualName` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the column `manualProtein` on the `FoodLog` table. All the data in the column will be lost.
  - Made the column `foodId` on table `FoodLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."FoodLog" DROP CONSTRAINT "FoodLog_foodId_fkey";

-- AlterTable
ALTER TABLE "public"."FoodLog" DROP COLUMN "manualCalories",
DROP COLUMN "manualCarbs",
DROP COLUMN "manualFat",
DROP COLUMN "manualName",
DROP COLUMN "manualProtein",
ALTER COLUMN "foodId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."FoodLog" ADD CONSTRAINT "FoodLog_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "public"."Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
