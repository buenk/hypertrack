"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type MacroPieProps = {
  protein: number | null | undefined;
  carbs: number | null | undefined;
  fat: number | null | undefined;
};

const toNumber = (n: number | null | undefined) =>
  Number.isFinite(n as number) ? (n as number) : 0;

export function MacroPie({ protein, carbs, fat }: MacroPieProps) {
  const proteinGrams = toNumber(protein);
  const carbsGrams = toNumber(carbs);
  const fatGrams = toNumber(fat);

  const chartData = [
    { macro: "protein", grams: proteinGrams, fill: "var(--color-protein)" },
    { macro: "carbs", grams: carbsGrams, fill: "var(--color-carbs)" },
    { macro: "fat", grams: fatGrams, fill: "var(--color-fat)" },
  ];

  const chartConfig = {
    grams: {
      label: "Grams",
    },
    protein: {
      label: "Protein",
      color: "var(--chart-1)",
    },
    carbs: {
      label: "Carbs",
      color: "var(--chart-2)",
    },
    fat: {
      label: "Fat",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Macro Breakdown</CardTitle>
        <CardDescription>Per 100g (or serving if specified)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="grams" />
            <ChartLegend
              content={({ payload, verticalAlign }) => (
                <ChartLegendContent
                  payload={
                    payload as readonly { value: string; color?: string }[]
                  }
                  verticalAlign={verticalAlign}
                  nameKey="macro"
                />
              )}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
