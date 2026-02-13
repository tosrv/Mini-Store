import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const getAuthHeader = () => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  return "Basic " + Buffer.from(serverKey + ":").toString("base64");
};

interface Products {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export async function POST(req: NextRequest) {
  try {
    const { order_id, gross_amount, customer, bank, products, shipping, tax } =
      await req.json();
    const supabase = await createClient();

    const items = [
      ...products.map((p: Products) => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
    ];

    if (shipping > 0) {
      items.push({
        id: "shipping",
        name: "Shipping Fee",
        quantity: 1,
        price: shipping,
      });
    }

    if (tax > 0) {
      items.push({
        id: "tax",
        name: "Tax 11%",
        quantity: 1,
        price: tax,
      });
    }

    const payload = {
      payment_type: "bank_transfer",

      transaction_details: {
        order_id,
        gross_amount,
      },

      bank_transfer: {
        bank,
      },

      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,

        billing_address: {
          first_name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        },

        shipping_address: {
          first_name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        },
      },

      item_details: items,
    };

    // console.log(payload, "Payload ke Midtrans");

    const [itemsRes, webhookRes] = await Promise.all([
      supabase.from("order_items").insert(
        products.map((product: Products) => ({
          order_id,
          product_id: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
      ),

      supabase.from("payment_webhooks").insert({
        order_id,
        payload,
      }),
    ]);

    if (itemsRes.error) console.error("Items error:", itemsRes.error);
    if (webhookRes.error) console.error("Webhook error:", webhookRes.error);

    const response = await fetch(
      "https://api.sandbox.midtrans.com/v2/charge", // Core API
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();
    const payment = data.va_numbers[0].va_number;
    console.log(data, "Response Midtrans");

    await supabase.from("orders").update({ payment }).eq("id", order_id);

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
