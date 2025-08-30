"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getSymptomLogs } from "@/lib/symptom-log-crud";
import { Plus } from "lucide-react";

export default function SymptomLogsPage() {
  const router = useRouter();
  const [symptomLogs, setSymptomLogs] = useState<
    Array<{
      id: string;
      createdAt: string | Date;
      symptom: string;
      severity: number;
      notes?: string;
    }>
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const sl = await getSymptomLogs();
        setSymptomLogs(sl);
      } catch {}
    })();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Symptom Logs</h1>
            <p className="mt-2 text-muted-foreground">Track your symptoms.</p>
          </div>
          <Button
            onClick={() => router.push("/symptom_logs/new")}
            className="mb-4"
          >
            <Plus /> Log symptom
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Recent Symptom Logs</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symptom</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {symptomLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No symptom logs yet.</TableCell>
                </TableRow>
              ) : (
                symptomLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.symptom}</TableCell>
                    <TableCell>{log.severity}</TableCell>
                    <TableCell className="max-w-[280px] truncate">
                      {log.notes ?? "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableCaption>Showing latest 10 entries</TableCaption>
          </Table>
        </div>
      </div>
    </>
  );
}
