import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getFoodLogById, updateFoodLog } from "@/lib/food-log-crud";
import { getAllFoods } from "@/lib/food-crud";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

export default async function EditFoodLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const log = await getFoodLogById(id);
  if (!log) return notFound();
  const foods = await getAllFoods();

  async function onSubmit(formData: FormData) {
    "use server";
    const foodId = formData.get("foodId")?.toString().trim() || undefined;
    const amountStr = formData.get("amount")?.toString().trim();
    const unit = formData.get("unit")?.toString().trim() || undefined;
    const notes = formData.get("notes")?.toString().trim() || undefined;

    const parseNumber = (s: string | undefined) => {
      if (!s) return undefined;
      const n = Number(s);
      return Number.isNaN(n) ? undefined : n;
    };

    await updateFoodLog(id, {
      foodId,
      amount: parseNumber(amountStr) ?? null,
      unit: unit ?? null,
      notes: notes ?? null,
    });

    redirect(`/food_logs/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit food log</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Food</Label>
              <Select name="foodId" defaultValue={log.food.id}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select food" />
                </SelectTrigger>
                <SelectContent>
                  {foods.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.1"
                  defaultValue={log.amount ?? undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </Label>
                <Input id="unit" name="unit" defaultValue={log.unit ?? ""} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={log.notes ?? ""}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
