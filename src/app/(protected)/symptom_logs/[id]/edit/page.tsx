import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getSymptomLogById } from "@/lib/symptom-log-crud";
import { getAllSymptoms } from "@/lib/symptom-crud";

export const dynamic = "force-dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSymptomLogAction } from "../../actions";
import { Label } from "@/components/ui/label";

export default async function EditSymptomLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const log = await getSymptomLogById(id);
  if (!log) return notFound();
  const symptoms = await getAllSymptoms();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit symptom log</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updateSymptomLogAction.bind(null, id)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-sm font-medium">Symptom</Label>
              <Select name="symptomId" defaultValue={log.symptom.id}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select symptom" />
                </SelectTrigger>
                <SelectContent>
                  {symptoms.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity" className="text-sm font-medium">
                  Severity (1-10)
                </Label>
                <Input
                  id="severity"
                  name="severity"
                  type="number"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={log.severity}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={log.notes ?? ""}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
