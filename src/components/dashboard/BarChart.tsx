import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  ResponsiveContainer,
  BarChart as BarGraph,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

type MonthData = {
  name: string;
  total: number;
};

export default function BarChart() {
  const [data, setData] = useState<MonthData[]>([]);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const { data: orders, error } = await supabase
        .from("orders")
        .select("total_price, created_at")
        .gte("created_at", yearStart);

      if (error) {
        console.error(error);
        return;
      }

      const monthlyTotals = Array(12).fill(0);
      orders?.forEach((order) => {
        const month = new Date(order.created_at).getMonth();
        monthlyTotals[month] += parseFloat(order.total_price);
      });

      const chartData = months.map((name, i) => ({
        name,
        total: monthlyTotals[i],
      }));

      setData(chartData);
    };

    fetchMonthlyRevenue();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarGraph data={data}>
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) =>
            value === 0 ? "0" : `${(value / 1_000_000).toFixed(1)} jt`
          }
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#4f46e5" />
      </BarGraph>
    </ResponsiveContainer>
  );
}
