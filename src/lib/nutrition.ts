export function scaleNutrition(
  food: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  },
  amount: number
) {
  // Assume food values are per 100g/ml
  // If unit is "piece" or "slice", you may need to store a "serving size" in Food later
  const factor = amount / 100;

  return {
    calories: food.calories ? food.calories * factor : null,
    protein: food.protein ? food.protein * factor : null,
    carbs: food.carbs ? food.carbs * factor : null,
    fat: food.fat ? food.fat * factor : null,
  };
}
