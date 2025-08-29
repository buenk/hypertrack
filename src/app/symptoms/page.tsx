import { SymptomForm } from "../../components/symptoms/SymptomForm";
import { getAllSymptoms } from "@/lib/symptom-crud";

export default async function SymptomsPage() {
  const symptoms = await getAllSymptoms();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Symptoms</h1>
      <SymptomForm
        symptoms={symptoms.map((s) => ({ id: s.id, name: s.name }))}
      />
    </>
  );
}
