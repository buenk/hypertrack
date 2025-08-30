"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { api } from "@/lib/auth";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function setHour(date: Date, hour: number, minute = 0) {
  const d = new Date(date);
  d.setHours(hour, minute, randomInt(0, 59), 0);
  return d;
}

export async function seedForCurrentUser() {
  const session = await api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return { error: "Not authenticated" } as const;

  // Ensure some foods exist (upsert-by-name behavior)
  const foodProfiles = [
    {
      name: "Chicken Sandwich",
      calories: 420,
      protein: 32,
      carbs: 44,
      fat: 12,
    },
    { name: "Ice cream", calories: 270, protein: 4, carbs: 31, fat: 14 },
    { name: "Pasta bolognese", calories: 560, protein: 26, carbs: 62, fat: 18 },
    { name: "Fried eggs", calories: 180, protein: 12, carbs: 1, fat: 14 },
    { name: "Avocado toast", calories: 360, protein: 8, carbs: 34, fat: 22 },
    {
      name: "White rice with fried salmon",
      calories: 640,
      protein: 36,
      carbs: 62,
      fat: 24,
    },
    {
      name: "White rice with steamed cod",
      calories: 500,
      protein: 35,
      carbs: 62,
      fat: 8,
    },
    {
      name: "White Monster energy",
      calories: 10,
      protein: 0,
      carbs: 2,
      fat: 0,
    },
    { name: "Coffee", calories: 2, protein: 0, carbs: 0, fat: 0 },
  ];

  const foods: Array<{ id: string; name: string }> = [];
  for (const f of foodProfiles) {
    const existing = await db.food.findFirst({ where: { name: f.name } });
    if (existing) {
      foods.push({ id: existing.id, name: existing.name });
      continue;
    }
    const created = await db.food.create({
      data: {
        name: f.name,
        source: "custom",
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
      },
    });
    foods.push({ id: created.id, name: created.name });
  }

  // Ensure symptoms exist
  const symptomNames = [
    "Bloating",
    "Diarrhea",
    "Bellyache",
    "Heartburn",
    "Nausea",
    "Fatigue",
  ];
  const symptoms: Record<string, string> = {};
  for (const name of symptomNames) {
    const existing = await db.symptom.findFirst({ where: { name } });
    const row =
      existing ||
      (await db.symptom.create({
        data: { name },
      }));
    symptoms[name] = row.id;
  }

  // Create a year of sample logs for this user
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 365);

  for (
    let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    const slots = [
      setHour(d, pick([8, 9, 10]), randomInt(0, 59)),
      setHour(d, pick([12, 13, 14]), randomInt(0, 59)),
      setHour(d, pick([18, 19, 20]), randomInt(0, 59)),
    ];
    const mealsToday = randomInt(1, 3);
    const times = slots
      .slice(0, mealsToday)
      .sort((a, b) => a.getTime() - b.getTime());

    for (const time of times) {
      const food = pick(foods);
      await db.foodLog.create({
        data: {
          createdAt: time,
          amount: 1,
          unit: "serving",
          foodId: food.id,
          userId,
        },
      });

      // Occasionally add symptoms after a meal
      const maybe = (p: number) => Math.random() < p;
      const symptomEntries: Array<{ name: string; severity: number }> = [];
      if (maybe(0.3))
        symptomEntries.push({ name: "Bloating", severity: randomInt(1, 3) });
      if (maybe(0.15))
        symptomEntries.push({ name: "Bellyache", severity: randomInt(1, 2) });
      if (maybe(0.1))
        symptomEntries.push({ name: "Fatigue", severity: randomInt(1, 2) });

      for (const s of symptomEntries) {
        const when = new Date(time.getTime() + randomInt(60, 150) * 60 * 1000);
        await db.symptomLog.create({
          data: {
            createdAt: when,
            severity: s.severity,
            userId,
            symptomId: symptoms[s.name],
          },
        });
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/food");
  return { ok: true } as const;
}
