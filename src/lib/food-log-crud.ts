"use server";

import { db } from "@/lib/db";
import { api } from "@/lib/auth";
import { headers } from "next/headers";

export async function createFoodLog(
  foodName: string,
  amount?: number,
  unit?: string,
  notes?: string
) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  // Ensure there is a Food row to link to
  const existingFood = await db.food.findFirst({ where: { name: foodName } });
  const food =
    existingFood ||
    (await db.food.create({
      data: { name: foodName, source: "custom" },
    }));

  return db.foodLog.create({
    data: {
      foodId: food.id,
      amount,
      unit,
      notes,
      userId: session.user.id,
    },
  });
}

export async function getFoodLogs() {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const rows = await db.foodLog.findMany({
    where: { userId: session.user.id },
    include: { food: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    food: r.food.name,
    quantity:
      r.amount != null
        ? `${Number.isInteger(r.amount) ? r.amount.toFixed(0) : r.amount} ${
            r.unit ?? ""
          }`.trim()
        : undefined,
    notes: r.notes ?? undefined,
  }));
}

export async function getFilteredFoodLogs(filters: {
  search?: string;
  brand?: string;
  caloriesRange?: string;
  page?: number;
  pageSize?: number;
}) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const {
    search,
    brand,
    caloriesRange,
    page = 1,
    pageSize = 10,
  } = filters || {};

  const where: Record<string, unknown> = { userId: session.user.id };

  // Build nested food filters
  const foodFilters: Record<string, unknown> = {};
  if (search && search.trim()) {
    foodFilters.name = { contains: search.trim(), mode: "insensitive" };
  }
  if (brand && brand.trim()) {
    foodFilters.brand = { contains: brand.trim(), mode: "insensitive" };
  }
  if (caloriesRange) {
    const r = caloriesRange.trim();
    if (r.includes("-")) {
      const [min, max] = r.split("-").map((n) => Number(n));
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        foodFilters.calories = { gte: min, lte: max };
      }
    } else if (r.endsWith("+")) {
      const min = Number(r.slice(0, -1));
      if (!Number.isNaN(min)) {
        foodFilters.calories = { gte: min };
      }
    }
  }

  if (Object.keys(foodFilters).length > 0) {
    where.food = { is: foodFilters };
  }

  const rows = await db.foodLog.findMany({
    where,
    include: { food: { select: { name: true } } },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    food: r.food.name,
    quantity:
      r.amount != null
        ? `${Number.isInteger(r.amount) ? r.amount.toFixed(0) : r.amount} ${
            r.unit ?? ""
          }`.trim()
        : undefined,
    notes: r.notes ?? undefined,
  }));
}

export async function getFoodLogById(id: string) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const row = await db.foodLog.findUnique({
    where: { id },
    include: { food: { select: { id: true, name: true, brand: true } } },
  });
  if (!row || row.userId !== session.user.id) return null;

  return {
    id: row.id,
    createdAt: row.createdAt,
    amount: row.amount ?? undefined,
    unit: row.unit ?? undefined,
    notes: row.notes ?? undefined,
    food: {
      id: row.food.id,
      name: row.food.name,
      brand: row.food.brand ?? undefined,
    },
  } as const;
}

export type UpdateFoodLogInput = {
  foodId?: string;
  amount?: number | null;
  unit?: string | null;
  notes?: string | null;
};

export async function updateFoodLog(id: string, input: UpdateFoodLogInput) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const existing = await db.foodLog.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id)
    throw new Error("Not found");

  const { foodId, amount, unit, notes } = input;

  return db.foodLog.update({
    where: { id },
    data: {
      ...(foodId ? { foodId } : {}),
      ...(amount !== undefined ? { amount } : {}),
      ...(unit !== undefined ? { unit } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });
}

export async function deleteFoodLog(id: string) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");
  const existing = await db.foodLog.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id)
    throw new Error("Not found");
  await db.foodLog.delete({ where: { id } });
}
