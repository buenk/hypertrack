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
import { getFoodLogs } from "@/lib/food-log-crud";
import { Beef } from "lucide-react";

export default function FoodLogsPage() {
  const router = useRouter();
  const [foodLogs, setFoodLogs] = useState<
    Array<{
      id: string;
      createdAt: string | Date;
      food: string;
      quantity?: string;
      notes?: string;
    }>
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const fl = await getFoodLogs();
        setFoodLogs(fl);
      } catch {}
    })();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Food logs</h1>
            <p className="mt-2 text-muted-foreground">Track your food.</p>
          </div>
          <Button
            onClick={() => router.push("/food_logs/new")}
            className="mb-4 md:mb-0 mt-4 md:mt-0"
          >
            <Beef /> Log food
          </Button>
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
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableCaption>Showing latest 10 entries</TableCaption>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
