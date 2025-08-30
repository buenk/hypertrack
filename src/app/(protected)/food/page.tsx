import { getAllFoods } from "@/lib/food-crud";
import { FoodView } from "@/components/food/FoodView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function FoodPage() {
  const foods = await getAllFoods();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Foods</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, and view foods
          </p>
        </div>
        <Link href="/food/new">
          <Button>
            <Plus />
            Add Food
          </Button>
        </Link>
      </div>
      <FoodView foods={foods} />
    </div>
  );
}
