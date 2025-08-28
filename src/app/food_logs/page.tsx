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

export default function FoodLogsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Food logs</h1>
          <p className="text-gray-600 mt-2">Track your food.</p>
        </div>

        <Button onClick={() => router.push("/food/new")}>Add food</Button>

        <div className="mt-10 space-y-10">
          <div>
            <h2 className="text-xl font-semibold mb-3">Recent Food Logs</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Food</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foodLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No food logs yet.</TableCell>
                  </TableRow>
                ) : (
                  foodLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">{log.food}</TableCell>
                      <TableCell>{log.quantity ?? "-"}</TableCell>
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
    </div>
  );
}
