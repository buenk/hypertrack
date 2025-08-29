import { SymptomForm } from "@/components/symptoms/SymptomForm";
import { getAllSymptoms } from "@/lib/symptom-crud";

export default async function NewSymptomLogPage() {
  const symptoms = await getAllSymptoms();

  return (
    <div className="mx-auto max-w-xl w-full">
      <h1 className="text-2xl font-semibold mb-4">Create Symptom</h1>
      <SymptomForm
        symptoms={symptoms.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
