"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "@/lib/money";

interface Props {
  data: { _id: string; name: string; spent: number; color: string }[];
  total: number;
}

export default function CategoryDonut({ data, total }: Props) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
        No spending to chart
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="spent"
            nameKey="name"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d._id} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: any) => format(Number(v))}
            contentStyle={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              fontSize: 13,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs text-neutral-400">Total spent</p>
        <p className="text-xl font-semibold">{format(total)}</p>
      </div>
    </div>
  );
}