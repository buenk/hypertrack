"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  submitFood,
  createFoodAction,
  lookupFoodByBarcodeAction,
} from "../../app/food/actions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type FoodOption = { id: string; name: string };
type FoodLogRow = {
  id: string;
  createdAt: string | Date;
  food: string;
  quantity?: string;
  notes?: string;
};

export function FoodForm({
  foods = [] as FoodOption[],
  logs = [] as FoodLogRow[],
}: {
  foods?: FoodOption[];
  logs?: FoodLogRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"log" | "create" | "search">("log");
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [unitValue, setUnitValue] = useState<string>("");
  const [barcodeValue, setBarcodeValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchResults, setSearchResults] = useState<
    Array<{ code: string; name: string; brands?: string }>
  >([]);
  const [searchTotalPages, setSearchTotalPages] = useState<number>(0);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      if (selectedFoodId) {
        const f = foods.find((x) => x.id === selectedFoodId);
        if (f) formData.set("food", f.name);
      }
      const res = await submitFood(formData);
      if ("error" in res) setError(res.error ?? null);
      else {
        toast.success("Food log added");
        router.refresh();
      }
    });
  }

  function onCreateFood(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createFoodAction(formData);
      if ("error" in res) setError(res.error ?? null);
      else {
        toast.success("Food created");
        setMode("log");
        router.refresh();
      }
    });
  }

  return (
    <>
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">Create Food</TabsTrigger>
          <TabsTrigger value="search">Search Food</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <form action={onCreateFood} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Chicken salad"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="brand" className="text-sm font-medium">
                  Brand (optional)
                </label>
                <Input id="brand" name="brand" />
              </div>
              <div className="space-y-2">
                <label htmlFor="barcode" className="text-sm font-medium">
                  Barcode (optional)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="barcode"
                    name="barcode"
                    value={barcodeValue}
                    onChange={(e) => setBarcodeValue(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setError(null);
                      const fd = new FormData();
                      fd.set("barcode", barcodeValue.trim());
                      startTransition(async () => {
                        await lookupFoodByBarcodeAction(fd);
                        router.refresh();
                      });
                    }}
                  >
                    Lookup
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="calories" className="text-sm font-medium">
                  Calories
                </label>
                <Input id="calories" name="calories" type="number" step="0.1" />
              </div>
              <div className="space-y-2">
                <label htmlFor="protein" className="text-sm font-medium">
                  Protein (g)
                </label>
                <Input id="protein" name="protein" type="number" step="0.1" />
              </div>
              <div className="space-y-2">
                <label htmlFor="carbs" className="text-sm font-medium">
                  Carbs (g)
                </label>
                <Input id="carbs" name="carbs" type="number" step="0.1" />
              </div>
              <div className="space-y-2">
                <label htmlFor="fat" className="text-sm font-medium">
                  Fat (g)
                </label>
                <Input id="fat" name="fat" type="number" step="0.1" />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create Food"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Open Food Facts by name..."
              />
              <Button
                type="button"
                onClick={() => {
                  setError(null);
                  if (!searchTerm.trim()) return;
                  startTransition(async () => {
                    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
                      searchTerm
                    )}&search_simple=1&action=process&json=1&page_size=10&page=${searchPage}`;
                    try {
                      const res = await fetch(url);
                      const data = await res.json();
                      const items = (data.products || []).map((p: any) => ({
                        code: p.code as string,
                        name: (p.product_name as string) || "Unnamed",
                        brands: (p.brands as string) || undefined,
                      }));
                      setSearchResults(items);
                      setSearchTotalPages(Number(data.page_count) || 0);
                    } catch (e) {
                      setError("Search failed");
                    }
                  });
                }}
              >
                Search
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No results</TableCell>
                  </TableRow>
                ) : (
                  searchResults.map((r) => (
                    <TableRow key={r.code}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.brands ?? "-"}</TableCell>
                      <TableCell>{r.code}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const fd = new FormData();
                            fd.set("barcode", r.code);
                            startTransition(async () => {
                              await lookupFoodByBarcodeAction(fd);
                              toast.success("Food added");
                              setMode("log");
                              router.refresh();
                            });
                          }}
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableCaption>Open Food Facts search</TableCaption>
            </Table>

            {searchTotalPages > 1 && (
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={searchPage <= 1}
                  onClick={() => setSearchPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {searchPage}{" "}
                  {searchTotalPages ? `of ${searchTotalPages}` : ""}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    searchTotalPages !== 0 && searchPage >= searchTotalPages
                  }
                  onClick={() => setSearchPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
