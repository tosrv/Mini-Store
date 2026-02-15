"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import PageTitle from "@/components/dashboard/PageTitle";
import Card, { CardContent, CardProps } from "@/components/dashboard/card";
import SalesCard, { SalesProps } from "@/components/dashboard/SalesCard";
import BarChart from "@/components/dashboard/BarChart";
import { Activity, CreditCard, Users } from "lucide-react";
import { FaRupiahSign } from "react-icons/fa6";
import { Spinner } from "@/components/ui/spinner";
import { formatRupiah } from "@/lib/utils";

export default function Home() {
  const [revenue, setRevenue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [recentSales, setRecentSales] = useState<SalesProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data: orders, error } = await supabase
          .from("orders")
          .select(
            "id, user_id, status, total_price, profiles!inner(name, email)",
          )
          .in("status", ["PAID", "SHIPPED"])

        if (error) throw error;

        const totalRevenue =
          orders?.reduce(
            (acc, order) => acc + parseFloat(order.total_price),
            0,
          ) || 0;
        setRevenue(totalRevenue);

        setSalesCount(orders?.length || 0);

        const sales: SalesProps[] =
          orders?.map((order: any) => ({
            name: order.profiles?.name || "Unknown",
            email: order.profiles?.email || "unknown@email.com",
            salesAmount: `Rp ${formatRupiah(order.total_price)}`,
          })) || [];

        setRecentSales(sales);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardData: CardProps[] = [
    {
      label: "Total Revenue",
      amount: `Rp ${formatRupiah(revenue)}`,
      icon: FaRupiahSign,
    },
    {
      label: "Sales",
      amount: `+${salesCount}`,
      icon: CreditCard,
    },
    {
      label: "Subscription",
      amount: "0",
      icon: Users,
    },

    {
      label: "Active Mow",
      amount: "0",
      icon: Activity,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50 space-x-5">
          <Spinner className="w-12 h-12 text-primary" />
          <p className="text-2xl font-semibold text-center">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Dashboard" />

      {/* Top Cards */}
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((data, index) => (
          <Card
            key={index}
            amount={data.amount}
            icon={data.icon}
            label={data.label}
          />
        ))}
      </section>

      {/* Charts & Recent Sales */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>
          <BarChart />
        </CardContent>

        <CardContent className="flex flex-col gap-4">
          <section>
            <p className="font-semibold">Recent Sales</p>
            <p className="text-sm text-gray-400">
              You made {salesCount} sales this month.
            </p>
          </section>

          <div className="flex flex-col gap-2">
            {recentSales.map((data, index) => (
              <SalesCard
                key={index}
                email={data.email}
                name={data.name}
                salesAmount={data.salesAmount}
              />
            ))}
          </div>
        </CardContent>
      </section>
    </div>
  );
}
