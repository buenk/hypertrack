"use client";

import { Food } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FoodView({ foods }: { foods: Food[] }) {
  if (foods.length === 0) return notFound();

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Barcode</TableHead>
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
                <TableCell>{f.brand ?? "-"}</TableCell>
                <TableCell>{f.source}</TableCell>
                <TableCell>{f.barcode ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableCaption>Click a row to view details</TableCaption>
      </Table>
    </div>
  );
}
