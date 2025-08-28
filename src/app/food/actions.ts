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
  const calories = formData.get("calories")?.toString().trim();
  const protein = formData.get("protein")?.toString().trim();
  const carbs = formData.get("carbs")?.toString().trim();
  const fat = formData.get("fat")?.toString().trim();

  if (!name) return { error: "Name is required" } as const;

  await createFood({
    name,
    brand,
    barcode,
    calories: calories ? Number(calories) : undefined,
    protein: protein ? Number(protein) : undefined,
    carbs: carbs ? Number(carbs) : undefined,
    fat: fat ? Number(fat) : undefined,
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
