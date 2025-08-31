import { getFilteredFoods } from "@/lib/food-crud";
import { FoodView } from "@/components/food/FoodView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FoodFilterBar } from "@/components/food/FoodFilterBar";
import { FoodPagination } from "@/components/food/FoodPagination";

export const dynamic = "force-dynamic";

export default async function FoodPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    caloriesRange?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const sp = await searchParams;

  const foods = await getFilteredFoods({
    search: sp.search,
    brand: sp.brand,
    caloriesRange: sp.caloriesRange,
    page: sp.page ? Number(sp.page) : undefined,
    pageSize: sp.pageSize ? Number(sp.pageSize) : undefined,
  });

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
      <FoodFilterBar
        filters={{
          search: sp.search ?? "",
          brand: sp.brand ?? "",
          caloriesRange: sp.caloriesRange ?? "",
        }}
      />
      <FoodView foods={foods} />
      <FoodPagination />
    </div>
  );
}
