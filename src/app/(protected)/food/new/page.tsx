import { FoodForm } from "@/components/food/FoodForm";

export default async function NewFoodPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Add Food</h1>
      <FoodForm />
    </>
  );
}
