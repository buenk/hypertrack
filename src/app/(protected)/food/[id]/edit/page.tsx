import { notFound, redirect } from "next/navigation";
import { getFoodById, updateFood } from "@/lib/food-crud";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

async function updateFoodAction(id: string, formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString().trim();
  const brand = formData.get("brand")?.toString().trim() || null;
  const barcode = formData.get("barcode")?.toString().trim() || null;
  const caloriesStr = formData.get("calories")?.toString().trim();
  const proteinStr = formData.get("protein")?.toString().trim();
  const carbsStr = formData.get("carbs")?.toString().trim();
  const fatStr = formData.get("fat")?.toString().trim();

  const calories = caloriesStr ? Number(caloriesStr) : null;
  const protein = proteinStr ? Number(proteinStr) : null;
  const carbs = carbsStr ? Number(carbsStr) : null;
  const fat = fatStr ? Number(fatStr) : null;

  if (!name) {
    throw new Error("Name is required");
  }

  await updateFood(id, { name, brand, barcode, calories, protein, carbs, fat });
  revalidatePath(`/food/${id}`);
  redirect(`/food/${id}`);
}

export default async function EditFoodPage({
  params,
}: {
  params: { id: string };
}) {
  const food = await getFoodById(params.id);
  if (!food) return notFound();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Edit Food</h1>

      <Card>
        <CardHeader>
          <CardTitle>{food.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updateFoodAction.bind(null, food.id)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={food.name} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  defaultValue={food.brand ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  name="barcode"
                  defaultValue={food.barcode ?? ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (per 100g)</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  step="0.1"
                  defaultValue={food.calories ?? undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (per 100g)</Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  step="0.1"
                  defaultValue={food.protein ?? undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (per 100g)</Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  step="0.1"
                  defaultValue={food.carbs ?? undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (per 100g)</Label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  step="0.1"
                  defaultValue={food.fat ?? undefined}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full">
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
