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
