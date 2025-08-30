"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitFood } from "../../app/(protected)/food/actions";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, CircleQuestionMark } from "lucide-react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type FoodOption = { id: string; name: string };

export function FoodLogForm({
  foods = [] as FoodOption[],
}: {
  foods?: FoodOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [unitValue, setUnitValue] = useState<string>("");
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

  return (
    <>
      <form action={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Food</Label>
          <div className="flex flex-col gap-2">
            <FoodCombobox
              foods={foods}
              value={selectedFoodId}
              onChange={(v) => setSelectedFoodId(v)}
            />
            <Link
              href="/food/new"
              className="text-sm text-muted-foreground font-medium hover:underline text-right flex items-center gap-1 justify-end"
            >
              <CircleQuestionMark className="size-4" />
              <span>Can&apos;t find your food?</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (optional)
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.1"
              placeholder="e.g. 100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit" className="text-sm font-medium">
              Unit (optional)
            </Label>
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
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes (optional)
          </Label>
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

function FoodCombobox({
  foods,
  value,
  onChange,
}: {
  foods: FoodOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = foods.find((f) => f.id === value) ?? null;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex-1 justify-between"
        >
          {selected ? selected.name : "— Select existing —"}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput placeholder="Search foods..." />
          <CommandEmpty>No foods found.</CommandEmpty>
          <CommandGroup>
            {foods.map((f) => (
              <CommandItem
                key={f.id}
                value={f.name}
                onSelect={() => {
                  onChange(f.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 size-4 ${
                    value === f.id ? "opacity-100" : "opacity-0"
                  }`}
                />
                {f.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
