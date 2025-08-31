import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FoodLogFilterBar } from "@/components/food_logs/FoodLogFilterBar";
import { FoodLogPagination } from "@/components/food_logs/FoodLogPagination";
import { getFilteredFoodLogs } from "@/lib/food-log-crud";
import { FoodLogView } from "@/components/food_logs/FoodLogView";

export const dynamic = "force-dynamic";

export default async function FoodLogsPage({
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

  const logs = await getFilteredFoodLogs({
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
          <h1 className="text-2xl font-semibold">Food logs</h1>
          <p className="text-sm text-muted-foreground">Track your food.</p>
        </div>
        <Link href="/food_logs/new">
          <Button>
            <Plus />
            Log food
          </Button>
        </Link>
      </div>
      <FoodLogFilterBar
        filters={{
          search: sp.search ?? "",
          brand: sp.brand ?? "",
          caloriesRange: sp.caloriesRange ?? "",
        }}
      />
      <FoodLogView logs={logs} />
      <FoodLogPagination />
    </div>
  );
}
