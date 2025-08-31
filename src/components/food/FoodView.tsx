"use client";

import { Food } from "@prisma/client";
import { redirect } from "next/navigation";
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

export function FoodView({ foods }: { foods: Food[] }) {
  if (foods.length === 0)
    return (
      <div className="mt-10 flex justify-center items-center h-full">
        <p className="text-muted-foreground flex gap-2">
          <UtensilsCrossed />
          No foods found! Try adjusting your filters.
        </p>
      </div>
    );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Calories</TableHead>
            <TableHead>Brand</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground">
                No foods yet.
              </TableCell>
            </TableRow>
          ) : (
            foods.map((f) => (
              <TableRow
                key={f.id}
                className="cursor-pointer"
                onClick={() => redirect(`/food/${f.id}`)}
              >
                <TableCell>{f.name}</TableCell>
                <TableCell>{f.calories ?? "-"}</TableCell>
                <TableCell>{f.brand ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableCaption>Click a row to view details</TableCaption>
      </Table>
    </div>
  );
}
