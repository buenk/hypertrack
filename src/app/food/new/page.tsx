import { FoodForm } from "@/components/food/FoodForm";
import { getAllFoods } from "@/lib/food-crud";
export default async function NewFoodPage() {
  const foods = await getAllFoods();

  return (
    <div className="mx-auto max-w-xl w-full p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Food</h1>
      <FoodForm foods={foods.map((f) => ({ id: f.id, name: f.name }))} />
    </div>
  );
}
