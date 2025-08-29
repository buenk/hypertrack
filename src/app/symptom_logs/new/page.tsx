import { SymptomLogForm } from "@/components/symptom_logs/SymptomLogForm";
import { getAllSymptoms } from "@/lib/symptom-crud";

export default async function NewSymptomLogPage() {
  const symptoms = await getAllSymptoms();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Log Symptom</h1>
      <SymptomLogForm
        symptoms={symptoms.map((s) => ({ id: s.id, name: s.name }))}
      />
    </>
  );
}
