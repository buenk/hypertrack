"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitFood, createFoodAction } from "../../app/food/actions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type FoodOption = { id: string; name: string };
type FoodLogRow = {
  id: string;
  createdAt: string | Date;
  food: string;
  quantity?: string;
  notes?: string;
};

export function FoodLogForm({
  foods = [] as FoodOption[],
  logs = [] as FoodLogRow[],
}: {
  foods?: FoodOption[];
  logs?: FoodLogRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"log" | "create" | "search">("log");
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [unitValue, setUnitValue] = useState<string>("");
  const [barcodeValue, setBarcodeValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchResults, setSearchResults] = useState<
    Array<{ code: string; name: string; brands?: string }>
  >([]);
  const [searchTotalPages, setSearchTotalPages] = useState<number>(0);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      if (selectedFoodId) {
        const f = foods.find((x) => x.id === selectedFoodId);
        if (f) formData.set("food", f.name);
      }
      const res = await submitFood(formData);
      if ("error" in res) setError(res.error ?? null);
      else {
        toast.success("Food log added");
        router.refresh();
      }
    });
  }

  function onCreateFood(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createFoodAction(formData);
      if ("error" in res) setError(res.error ?? null);
      else {
        toast.success("Food created");
        setMode("log");
        router.refresh();
      }
    });
  }

  return (
    <>
      <form action={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Food</label>
          <div className="flex gap-2">
            <Select value={selectedFoodId} onValueChange={setSelectedFoodId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="— Select existing —" />
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
        </div>

        <div className="space-y-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push("/food/new");
            }}
          >
            Add food
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount (optional)
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.1"
              placeholder="e.g. 100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="unit" className="text-sm font-medium">
              Unit (optional)
            </label>
            <Select value={unitValue} onValueChange={(v) => setUnitValue(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">grams (g)</SelectItem>
                <SelectItem value="kg">kilograms (kg)</SelectItem>
                <SelectItem value="ml">milliliters (ml)</SelectItem>
                <SelectItem value="l">liters (l)</SelectItem>
                <SelectItem value="piece">pieces</SelectItem>
                <SelectItem value="plate">plates</SelectItem>
                <SelectItem value="cup">cups</SelectItem>
                <SelectItem value="tbsp">tablespoons (tbsp)</SelectItem>
                <SelectItem value="tsp">teaspoons (tsp)</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="unit" value={unitValue} />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes (optional)
          </label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any notes..."
            rows={4}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="pt-2">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Add Log"}
          </Button>
        </div>
      </form>
    </>
  );
}
