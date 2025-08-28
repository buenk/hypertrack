"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
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
import { getFoodLogs } from "@/lib/food-log-crud";
import { getSymptomLogs } from "@/lib/symptom-log-crud";

export default function SymptomLogsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [foodLogs, setFoodLogs] = useState<
    Array<{
      id: string;
      createdAt: string | Date;
      food: string;
      quantity?: string;
      notes?: string;
    }>
  >([]);
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
        const [fl, sl] = await Promise.all([getFoodLogs(), getSymptomLogs()]);
        setFoodLogs(fl);
        setSymptomLogs(sl);
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Symptom Logs</h1>
          <p className="text-gray-600 mt-2">Track your symptoms.</p>
        </div>

        <Button onClick={() => router.push("/symptom_logs/new")}>
          Log symptom
        </Button>

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
    </div>
  );
}
