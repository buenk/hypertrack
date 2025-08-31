"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
//
import { Button } from "@/components/ui/button";
import { submitSymptom } from "../../app/(protected)/symptoms/actions";
import { useRouter } from "next/navigation";
//
import { toast } from "sonner";
//
import { Label } from "../ui/label";

type SymptomOption = { id: string; name: string };

export function SymptomForm({
  symptoms = [] as SymptomOption[],
}: {
  symptoms?: SymptomOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedSymptomId] = useState<string>("");
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      if (selectedSymptomId) {
        const s = symptoms.find((x) => x.id === selectedSymptomId);
        if (s) formData.set("symptom", s.name);
      }
      const res = await submitSymptom(formData);
      if ("error" in res) setError(res.error ?? null);
      else {
        toast.success("Symptom log added");
        router.refresh();
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name
        </Label>
        <Input id="name" name="name" placeholder="e.g. Headache" required />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Symptom"}
        </Button>
      </div>
    </form>
  );
}
