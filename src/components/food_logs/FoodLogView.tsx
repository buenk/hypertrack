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
import { UtensilsCrossed } from "lucide-react";

export type FoodLogRow = {
  id: string;
  createdAt: string | Date;
  food: string;
  quantity?: string;
  notes?: string;
};

export function FoodLogView({ logs }: { logs: FoodLogRow[] }) {
  if (logs.length === 0)
    return (
      <div className="mt-10 flex justify-center items-center h-full">
        <p className="text-muted-foreground flex gap-2">
          <UtensilsCrossed />
          No food logs found! Try adjusting your filters.
        </p>
      </div>
    );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Food</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                No food logs yet.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow
                key={log.id}
                className="cursor-pointer"
                onClick={() => (window.location.href = `/food_logs/${log.id}`)}
              >
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{log.food}</TableCell>
                <TableCell>{log.quantity ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableCaption>Showing results</TableCaption>
      </Table>
    </div>
  );
}
