"use server";

import { db } from "@/lib/db";

export type CreateSymptomInput = {
  name: string;
};

export async function createSymptom(input: CreateSymptomInput) {
  const { name } = input;
  return db.symptom.create({
    data: { name },
  });
}

export async function getAllSymptoms() {
  return db.symptom.findMany({
    orderBy: { createdAt: "desc" },
  });
}
