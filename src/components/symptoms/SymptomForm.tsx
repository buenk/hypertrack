"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitSymptom, createSymptomAction } from "../../app/symptoms/actions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SymptomOption = { id: string; name: string };

export function SymptomForm({
  symptoms = [] as SymptomOption[],
}: {
  symptoms?: SymptomOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"log" | "create">("log");
  const [selectedSymptomId, setSelectedSymptomId] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
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

  function onCreateSymptom(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createSymptomAction(formData);
      if ("error" in res) setError(res.error ?? null);
      else {
        toast.success("Symptom created");
        setMode("log");
        router.refresh();
      }
    });
  }

  return (
    <form action={onCreateSymptom} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
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
