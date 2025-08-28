// lib/openfoodfacts.ts
export async function fetchProductByBarcode(barcode: string) {
  const res = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );
  const data = await res.json();

  if (data.status === 0) return null;

  const p = data.product;

  return {
    name: p.product_name || "Unknown",
    brand: p.brands || null,
    barcode: p.code,
    calories: p.nutriments?.["energy-kcal_100g"] || null,
    protein: p.nutriments?.proteins_100g || null,
    carbs: p.nutriments?.carbohydrates_100g || null,
    fat: p.nutriments?.fat_100g || null,
    source: "openfoodfacts",
  };
}

export async function searchProducts(query: string, pageSize = 10) {
  const res = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      query
    )}&search_simple=1&action=process&json=1&page_size=${pageSize}`
  );
  const data = await res.json();

  return data.products.map((p: any) => ({
    name: p.product_name || "Unknown",
    brand: p.brands || null,
    barcode: p.code,
    calories: p.nutriments?.["energy-kcal_100g"] || null,
    protein: p.nutriments?.proteins_100g || null,
    carbs: p.nutriments?.carbohydrates_100g || null,
    fat: p.nutriments?.fat_100g || null,
    source: "openfoodfacts",
  }));
}
