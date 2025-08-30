import { FoodLogForm } from "@/components/food_logs/FoodLogForm";
import { getAllFoods } from "@/lib/food-crud";
export default async function NewFoodLogPage() {
  const foods = await getAllFoods();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Log food</h1>
      <FoodLogForm foods={foods.map((f) => ({ id: f.id, name: f.name }))} />
    </>
  );
}
