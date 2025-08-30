"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  submitSymptom,
  createSymptomAction,
} from "../../app/(protected)/symptoms/actions";
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
import { Label } from "../ui/label";

type SymptomOption = { id: string; name: string };

export function SymptomLogForm({
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
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Symptom</Label>
        <div className="flex gap-2">
          <Select
            value={selectedSymptomId}
            onValueChange={setSelectedSymptomId}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="— Select existing —" />
            </SelectTrigger>
            <SelectContent>
              {symptoms.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="symptom"
            name="symptom"
            placeholder="Or type a new symptom"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Severity (1-10)</Label>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="severity" value={severity} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes (optional)
        </Label>
        <Textarea id="notes" name="notes" placeholder="Any notes..." rows={4} />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Adding..." : "Add Symptom Log"}
        </Button>
      </div>
    </form>
  );
}
