import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFoodLogById } from "@/lib/food-log-crud";
import { Pencil } from "lucide-react";
import { FoodLogDeleteButton } from "@/components/food_logs/FoodLogDeleteButton";

export const dynamic = "force-dynamic";

export default async function FoodLogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const log = await getFoodLogById(id);
  if (!log) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Food log</CardTitle>
            <div className="flex items-center gap-2">
              <FoodLogDeleteButton id={log.id} />
              <Button variant="outline">
                <Link href={`/food_logs/${log.id}/edit`}>
                  <div className="flex gap-2 items-center">
                    <Pencil />
                    Edit
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Food" value={log.food.name} />
            <Detail label="Brand" value={log.food.brand ?? "—"} />
            <Detail label="Amount" value={formatAmount(log.amount)} />
            <Detail label="Unit" value={log.unit ?? "—"} />
            <Detail
              label="Created"
              value={new Date(log.createdAt).toLocaleString()}
            />
            <div className="col-span-2">
              <Detail label="Notes" value={log.notes ?? "—"} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold break-words">{value}</div>
    </div>
  );
}

function formatAmount(n: number | undefined) {
  if (n == null) return "—";
  return Number.isInteger(n) ? n.toFixed(0) : n.toString();
}
