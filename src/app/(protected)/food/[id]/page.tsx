import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { api } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getFoodById } from "@/lib/food-crud";
import { MacroPie } from "@/components/food/MacroPie";
import { Pencil } from "lucide-react";
import { FoodDeleteButton } from "@/components/food/FoodDeleteButton";

export default async function FoodDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const food = await getFoodById(id);
  if (!food) return notFound();

  const session = await api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  const logs = userId
    ? await db.foodLog.findMany({
        where: { foodId: food.id, userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{food.name}</CardTitle>
            <div className="flex items-center gap-2">
              <FoodDeleteButton id={food.id} />
              <Button variant="outline">
                <Link href={`/food/${food.id}/edit`}>
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
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {food.brand && (
              <div className="text-muted-foreground">
                Brand: <span className="text-foreground">{food.brand}</span>
              </div>
            )}
            <div className="text-muted-foreground">
              Source:{" "}
              <span className="text-foreground capitalize">{food.source}</span>
            </div>
            {food.barcode && (
              <div className="text-muted-foreground">
                Barcode: <span className="text-foreground">{food.barcode}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="mb-10 md:mb-4">
            <MacroPie
              protein={food.protein}
              carbs={food.carbs}
              fat={food.fat}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Macro label="Calories" value={food.calories} unit="kcal" />
            <Macro label="Protein" value={food.protein} unit="g" />
            <Macro label="Carbs" value={food.carbs} unit="g" />
            <Macro label="Fat" value={food.fat} unit="g" />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      No logs yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        {new Date(l.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {formatAmount(l.amount)} {l.unit ?? ""}
                      </TableCell>
                      <TableCell className="max-w-[320px] truncate">
                        {l.notes ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableCaption>Showing latest 10 entries</TableCaption>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Macro({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | null | undefined;
  unit: string;
}) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">
        {value != null ? `${value} ${unit}` : "—"}
      </div>
    </div>
  );
}

function formatAmount(n: number | null | undefined) {
  if (n == null) return "-";
  return Number.isInteger(n) ? n.toFixed(0) : n.toString();
}
