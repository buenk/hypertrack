"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity } from "lucide-react";

export type SymptomLogRow = {
  id: string;
  createdAt: string | Date;
  symptom: string;
  severity: number;
  notes?: string;
};

export function SymptomLogView({ logs }: { logs: SymptomLogRow[] }) {
  if (logs.length === 0)
    return (
      <div className="mt-10 flex justify-center items-center h-full">
        <p className="text-muted-foreground flex gap-2">
          <Activity />
          No symptom logs found! Try adjusting your filters.
        </p>
      </div>
    );

  return (
    <div>
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
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                No symptom logs yet.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow
                key={log.id}
                className="cursor-pointer"
                onClick={() =>
                  (window.location.href = `/symptom_logs/${log.id}`)
                }
              >
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{log.symptom}</TableCell>
                <TableCell>{log.severity}</TableCell>
                <TableCell className="max-w-[320px] truncate">
                  {log.notes ?? "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableCaption>Showing results</TableCaption>
      </Table>
    </div>
  );
}
