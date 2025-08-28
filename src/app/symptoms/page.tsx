import { SymptomForm } from "../../components/symptoms/SymptomForm";
import { getSymptomLogs } from "@/lib/symptom-log-crud";
import { getAllSymptoms } from "@/lib/symptom-crud";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function SymptomsPage() {
  const [logs, symptoms] = await Promise.all([
    getSymptomLogs(),
    getAllSymptoms(),
  ]);

  return (
    <div className="mx-auto max-w-xl w-full p-6">
      <h1 className="text-2xl font-semibold mb-4">Log Symptom</h1>
      <SymptomForm
        symptoms={symptoms.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
