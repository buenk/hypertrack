import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SymptomLogFilterBar } from "@/components/symptom_logs/SymptomLogFilterBar";
import { SymptomLogPagination } from "@/components/symptom_logs/SymptomLogPagination";
import { getFilteredSymptomLogs } from "@/lib/symptom-log-crud";
import { SymptomLogView } from "@/components/symptom_logs/SymptomLogView";

export const dynamic = "force-dynamic";

export default async function SymptomLogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    severityRange?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const sp = await searchParams;

  const logs = await getFilteredSymptomLogs({
    search: sp.search,
    severityRange: sp.severityRange,
    page: sp.page ? Number(sp.page) : undefined,
    pageSize: sp.pageSize ? Number(sp.pageSize) : undefined,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Symptom Logs</h1>
          <p className="text-sm text-muted-foreground">Track your symptoms.</p>
        </div>
        <Link href="/symptom_logs/new">
          <Button>
            <Plus />
            Log symptom
          </Button>
        </Link>
      </div>
      <SymptomLogFilterBar
        filters={{
          search: sp.search ?? "",
          severityRange: sp.severityRange ?? "",
        }}
      />
      <SymptomLogView logs={logs} />
      <SymptomLogPagination />
    </div>
  );
}
