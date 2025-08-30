"use server";

import { db } from "@/lib/db";
import { fetchProductByBarcode } from "./openfoodfacts";

export type CreateFoodInput = {
  name: string;
  brand?: string;
  barcode?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  source?: string; // e.g., "openfoodfacts" | "custom"
};

export async function createFood(input: CreateFoodInput) {
  const {
    name,
    brand,
    barcode,
    calories,
    protein,
    carbs,
    fat,
    source = "custom",
  } = input;

  return db.food.create({
    data: {
      name,
      brand,
      barcode,
      calories,
      protein,
      carbs,
      fat,
      source,
    },
  });
}

export async function getAllFoods() {
  return db.food.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getFoodById(id: string) {
  return db.food.findUnique({ where: { id } });
}

export type UpdateFoodInput = {
  name?: string;
  brand?: string | null;
  barcode?: string | null;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
};

export async function updateFood(id: string, input: UpdateFoodInput) {
  const { name, brand, barcode, calories, protein, carbs, fat } = input;
  return db.food.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(brand !== undefined ? { brand } : {}),
      ...(barcode !== undefined ? { barcode } : {}),
      ...(calories !== undefined ? { calories } : {}),
      ...(protein !== undefined ? { protein } : {}),
      ...(carbs !== undefined ? { carbs } : {}),
      ...(fat !== undefined ? { fat } : {}),
    },
  });
}

export async function getOrCreateFoodByBarcode(barcode: string) {
  // Check if already in DB
  let food = await db.food.findUnique({ where: { barcode } });
  if (food) return food;

  // Otherwise fetch from OpenFoodFacts
  const product = await fetchProductByBarcode(barcode);
  if (!product) return null;

  // Save in DB
  food = await db.food.create({ data: product });
  return food;
}
