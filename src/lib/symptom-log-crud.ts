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

export async function getFilteredSymptomLogs(filters: {
  search?: string; // symptom name contains
  severityRange?: string; // e.g. "1-5", "6-10"
  page?: number;
  pageSize?: number;
}) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const { search, severityRange, page = 1, pageSize = 10 } = filters || {};

  const where: Record<string, unknown> = { userId: session.user.id };

  if (search && search.trim()) {
    where.symptom = {
      is: { name: { contains: search.trim(), mode: "insensitive" } },
    };
  }
  if (severityRange) {
    const r = severityRange.trim();
    if (r.includes("-")) {
      const [min, max] = r.split("-").map((n) => Number(n));
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        where.severity = { gte: min, lte: max };
      }
    }
  }

  const rows = await db.symptomLog.findMany({
    where,
    include: { symptom: { select: { name: true } } },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    symptom: r.symptom.name,
    severity: r.severity,
    notes: r.notes ?? undefined,
  }));
}

export async function getSymptomLogById(id: string) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const row = await db.symptomLog.findUnique({
    where: { id },
    include: { symptom: { select: { id: true, name: true } } },
  });
  if (!row || row.userId !== session.user.id) return null;

  return {
    id: row.id,
    createdAt: row.createdAt,
    severity: row.severity,
    notes: row.notes ?? undefined,
    symptom: { id: row.symptom.id, name: row.symptom.name },
  } as const;
}

export type UpdateSymptomLogInput = {
  symptomId?: string;
  severity?: number; // must be 1-10 if provided
  notes?: string | null;
};

export async function updateSymptomLog(
  id: string,
  input: UpdateSymptomLogInput
) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");

  const existing = await db.symptomLog.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id)
    throw new Error("Not found");

  const { symptomId, severity, notes } = input;

  return db.symptomLog.update({
    where: { id },
    data: {
      ...(symptomId ? { symptom: { connect: { id: symptomId } } } : {}),
      ...(typeof severity === "number" ? { severity } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });
}

export async function deleteSymptomLog(id: string) {
  const session = await api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Not authenticated");
  const existing = await db.symptomLog.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id)
    throw new Error("Not found");
  await db.symptomLog.delete({ where: { id } });
}
