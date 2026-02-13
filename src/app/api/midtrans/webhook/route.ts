import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

interface MidtransWebhookBody {
  order_id: string;
  status_code: string | number;
  gross_amount: string | number;
  signature_key: string;
}

const verifySignature = (body: MidtransWebhookBody) => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;

  const raw = body.order_id + body.status_code + body.gross_amount + serverKey;

  const expectedSignature = crypto
    .createHash("sha512")
    .update(raw)
    .digest("hex");

  return expectedSignature === body.signature_key;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("body from midtrans webhook", body);

    const supabase = await createClient();

    if (!verifySignature(body)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const { order_id, transaction_status } = body;

    if (transaction_status === "settlement") {
      console.log("✅ Payment received:", order_id);

      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("user_id, status")
        .eq("id", order_id)
        .single();

      if (fetchError || !order) {
        throw new Error(`Order ${order_id} not found`);
      }

      if (order.status === "PAID") {
        return NextResponse.json({ message: "Order already processed" });
      }

      const { error: rpcError } = await supabase.rpc(
        "handle_successful_payment",
        {
          p_order_id: order_id,
          p_user_id: order.user_id,
        },
      );

      if (rpcError) {
        console.error("Transaction failed:", rpcError.message);

        if (rpcError.message.includes("Insufficient stock")) {
          await supabase
            .from("orders")
            .update({ status: "FAILED_STOCK" })
            .eq("id", order_id);
        }

        return NextResponse.json({ error: rpcError.message }, { status: 400 });
      }

      console.log("DB (Order, Stock, Cart) updated successfully");
    } else if (["expire", "cancel", "deny"].includes(transaction_status)) {
      await supabase
        .from("orders")
        .update({ status: "CANCELED" })
        .eq("id", order_id);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
