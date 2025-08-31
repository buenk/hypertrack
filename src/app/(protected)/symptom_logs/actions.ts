"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteSymptomLog, updateSymptomLog } from "@/lib/symptom-log-crud";

export async function updateSymptomLogAction(id: string, formData: FormData) {
  const symptomId = formData.get("symptomId")?.toString().trim() || undefined;
  const severityStr = formData.get("severity")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim() || null;

  const parseNumber = (s: string | undefined) => {
    if (!s) return undefined;
    const n = Number(s);
    return Number.isNaN(n) ? undefined : n;
  };

  const severityNum = parseNumber(severityStr);
  await updateSymptomLog(id, {
    symptomId,
    ...(typeof severityNum === "number" ? { severity: severityNum } : {}),
    notes,
  });

  revalidatePath(`/symptom_logs/${id}`);
  redirect(`/symptom_logs/${id}`);
}

export async function deleteSymptomLogFormAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await deleteSymptomLog(id);
  revalidatePath("/symptom_logs");
  redirect("/symptom_logs");
}
