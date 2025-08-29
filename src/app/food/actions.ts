"use server";

import { revalidatePath } from "next/cache";
import { createFoodLog } from "@/lib/food-log-crud";
import { createFood, getOrCreateFoodByBarcode } from "@/lib/food-crud";

export async function submitFood(formData: FormData) {
  const food = formData.get("food")?.toString().trim();
  const amountStr = formData.get("amount")?.toString().trim();
  const unit = formData.get("unit")?.toString().trim() || undefined;
  const notes = formData.get("notes")?.toString().trim() || undefined;

  if (!food) return { error: "Food is required" } as const;

  const amount = amountStr ? Number(amountStr) : undefined;
  if (amountStr && Number.isNaN(amount))
    return { error: "Amount must be a number" } as const;

  await createFoodLog(food, amount, unit, notes);
  revalidatePath("/food");
  return { ok: true } as const;
}

export async function createFoodAction(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const brand = formData.get("brand")?.toString().trim() || undefined;
  const barcode = formData.get("barcode")?.toString().trim() || undefined;
  const calories = formData.get("calories");
  const protein = formData.get("protein");
  const carbs = formData.get("carbs");
  const fat = formData.get("fat");

  if (!name) return { error: "Name is required" } as const;

  // Parse numbers without treating 0 as undefined
  const parseMaybeNumber = (
    v: FormDataEntryValue | null
  ): number | undefined => {
    if (v == null) return undefined;
    const str = v.toString().trim();
    if (str === "") return undefined;
    const n = Number(str.replace(",", "."));
    return Number.isNaN(n) ? undefined : n;
  };

  await createFood({
    name,
    brand,
    barcode,
    calories: parseMaybeNumber(calories),
    protein: parseMaybeNumber(protein),
    carbs: parseMaybeNumber(carbs),
    fat: parseMaybeNumber(fat),
  });

  revalidatePath("/food");
  return { ok: true } as const;
}

export async function lookupFoodByBarcodeAction(formData: FormData) {
  const barcode = formData.get("barcode")?.toString().trim();
  if (!barcode) return { error: "Barcode is required" } as const;

  await getOrCreateFoodByBarcode(barcode);
  revalidatePath("/food");
  return { ok: true } as const;
}
