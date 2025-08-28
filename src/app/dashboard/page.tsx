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

export default function DashboardPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your food and symptoms</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Name: </span>
                <span className="text-gray-900">
                  {session?.user?.name || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email: </span>
                <span className="text-gray-900">
                  {session?.user?.email || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Member since:{" "}
                </span>
                <span className="text-gray-900">
                  {session?.user?.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push("/food_logs/new")}
                className="w-full"
                size="lg"
              >
                Log Food
              </Button>
              <Button
                onClick={() => router.push("/symptoms")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Log Symptoms
              </Button>
            </CardContent>
          </Card>
        </div>

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
                      <TableCell className="font-medium">
                        {log.symptom}
                      </TableCell>
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
    </div>
  );
}
