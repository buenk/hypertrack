"use server";

import { db } from "@/lib/db";
import { api } from "@/lib/auth";
import { headers } from "next/headers";

export async function createSymptomLog(
  symptomName: string,
  severity: number,
  notes?: string
) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  // Ensure there is a Symptom row to link to
  const existing = await db.symptom.findFirst({ where: { name: symptomName } });
  const symptom =
    existing || (await db.symptom.create({ data: { name: symptomName } }));

  return db.symptomLog.create({
    data: {
      symptomId: symptom.id,
      severity,
      notes,
      userId: session.user.id,
    },
  });
}

export async function getSymptomLogs() {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const rows = await db.symptomLog.findMany({
    where: { userId: session.user.id },
    include: { symptom: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    symptom: r.symptom.name,
    severity: r.severity,
    notes: r.notes ?? undefined,
  }));
}
