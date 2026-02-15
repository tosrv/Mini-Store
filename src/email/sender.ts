import { supabase } from "@/lib/supabase/client";

const statusToTypeMap: Record<string, string> = {
  PAID: "payment",
  SHIPPED: "shipped",
  CANCELLED: "cancelled",
};

export async function startRealtime() {
  supabase
    .channel("orders")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "orders" },
      async (payload) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", payload.new.user_id)
          .single();

        if (!profile?.email) return;

        const type = statusToTypeMap[payload.new.status];
        if (!type) return;

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            orderId: payload.new.id,
            total: payload.new.total_price,
            userEmail: profile.email,
          }),
        });
      },
    )
    .subscribe();
}

startRealtime().catch(console.error);
