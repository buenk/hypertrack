"use server";

import { revalidatePath } from "next/cache";
import { createSymptom } from "@/lib/symptom-crud";
import { createSymptomLog } from "@/lib/symptom-log-crud";

export async function submitSymptom(formData: FormData) {
  const symptom = formData.get("symptom")?.toString().trim();
  const severityStr = formData.get("severity")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim() || undefined;

  if (!symptom) return { error: "Symptom is required" } as const;
  if (!severityStr) return { error: "Severity is required" } as const;

  const severity = Number(severityStr);
  if (Number.isNaN(severity) || severity < 1 || severity > 10) {
    return { error: "Severity must be between 1 and 10" } as const;
  }

  await createSymptomLog(symptom, severity, notes);
  revalidatePath("/symptoms");
  return { ok: true } as const;
}

export async function createSymptomAction(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  if (!name) return { error: "Name is required" } as const;

  await createSymptom({ name });
  revalidatePath("/symptoms");
  return { ok: true } as const;
}
