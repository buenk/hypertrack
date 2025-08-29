"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";
import type { PieLabelProps as RPieLabelProps } from "recharts/types/polar/Pie";

export function MacroPie({
  protein,
  carbs,
  fat,
}: {
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
}) {
  const p = typeof protein === "number" ? Math.max(0, protein) : 0;
  const c = typeof carbs === "number" ? Math.max(0, carbs) : 0;
  const f = typeof fat === "number" ? Math.max(0, fat) : 0;
  const total = p + c + f;
  if (total <= 0) return null;

  const data = [
    { name: "Protein", value: p },
    { name: "Carbs", value: c },
    { name: "Fat", value: f },
  ];

  // Use shadcn chart tokens mapped in @theme (globals.css)
  const colors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
  ];

  const percentByName: Record<string, number> = {
    Protein: Math.round((p / total) * 100),
    Carbs: Math.round((c / total) * 100),
    Fat: Math.round((f / total) * 100),
  };

  const renderLabel = (props: RPieLabelProps) => {
    const cx = (props.cx ?? 0) as number;
    const cy = (props.cy ?? 0) as number;
    const midAngle = (props.midAngle ?? 0) as number;
    const innerRadius = (props.innerRadius ?? 0) as number;
    const outerRadius = (props.outerRadius ?? 0) as number;
    const index = (props.index ?? 0) as number;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const value = percentByName[data[index].name as string];
    return (
      <text
        x={x}
        y={y}
        fill={colors[index]}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {value}%
      </text>
    );
  };

  return (
    <div className="h-60 w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={0}
            outerRadius={100}
            paddingAngle={2}
            stroke="var(--color-background)"
            labelLine={false}
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} g (${percentByName[name]}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            align="center"
            content={(props) => (
              <LegendContent {...props} percentByName={percentByName} />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function LegendContent({
  payload,
  percentByName,
}: {
  payload?: readonly LegendPayload[];
  percentByName: Record<string, number>;
}) {
  if (!payload || payload.length === 0) return null;
  return (
    <ul className="mt-2 flex justify-center mt-4 flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
      {payload.map((item) => (
        <li key={String(item.value)} className="flex items-center gap-2">
          <span
            className="inline-block size-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="capitalize text-foreground/90">
            {String(item.value)} ({percentByName[String(item.value)]}%)
          </span>
        </li>
      ))}
    </ul>
  );
}
