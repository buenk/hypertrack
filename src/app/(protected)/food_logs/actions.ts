"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteFoodLog } from "@/lib/food-log-crud";

export async function deleteFoodLogFormAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await deleteFoodLog(id);
  revalidatePath("/food_logs");
  redirect("/food_logs");
}
