"use client";

import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid,
} from "recharts";
import { format } from "@/lib/money";

interface Props {
  data: { label: string; spent: number; saved: number; income: number }[];
}

export default function MonthlyBars({ data }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickFormatter={(v) => `£${Math.round(v / 100)}`}
            width={48}
          />
          <Tooltip
            formatter={(v: any) => format(Number(v))}
            contentStyle={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              fontSize: 13,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Bar dataKey="spent" name="Spent" fill="#f97316" radius={[6, 6, 0, 0]} />
          <Bar dataKey="saved" name="Saved" fill="#14b8a6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}