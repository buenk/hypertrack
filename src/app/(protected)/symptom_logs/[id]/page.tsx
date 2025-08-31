import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSymptomLogById } from "@/lib/symptom-log-crud";
import { Pencil } from "lucide-react";
import { SymptomLogDeleteButton } from "@/components/symptom_logs/SymptomLogDeleteButton";

export const dynamic = "force-dynamic";

export default async function SymptomLogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const log = await getSymptomLogById(id);
  if (!log) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Symptom log</CardTitle>
            <div className="flex items-center gap-2">
              <SymptomLogDeleteButton id={log.id} />
              <Button variant="outline">
                <Link href={`/symptom_logs/${log.id}/edit`}>
                  <div className="flex gap-2 items-center">
                    <Pencil />
                    Edit
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Symptom" value={log.symptom.name} />
            <Detail label="Severity" value={String(log.severity)} />
            <Detail
              label="Created"
              value={new Date(log.createdAt).toLocaleString()}
            />
            <div className="col-span-2">
              <Detail label="Notes" value={log.notes ?? "—"} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold break-words">{value}</div>
    </div>
  );
}
