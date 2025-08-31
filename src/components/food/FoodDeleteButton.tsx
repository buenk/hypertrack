"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { deleteFoodFormAction } from "@/app/(protected)/food/actions";

export function FoodDeleteButton({ id }: { id: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="size-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete food?</DialogTitle>
          <DialogDescription>
            This will remove the food and its related logs. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <form action={deleteFoodFormAction}>
          <input type="hidden" name="id" value={id} />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              className="cursor-pointer"
            >
              <Trash />
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
