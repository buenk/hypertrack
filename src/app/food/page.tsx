import { FoodForm } from "../../components/food/FoodForm";
import { getFoodLogs } from "@/lib/food-log-crud";
import { getAllFoods } from "@/lib/food-crud";
export default async function FoodPage() {
  const [logs, foods] = await Promise.all([getFoodLogs(), getAllFoods()]);

  return (
    <div className="mx-auto max-w-xl w-full p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Food Log</h1>
      <FoodForm
        foods={foods.map((f) => ({ id: f.id, name: f.name }))}
        logs={logs}
      />
    </div>
  );
}
