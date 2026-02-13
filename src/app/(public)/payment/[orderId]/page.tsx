"use client";

import { CardContent } from "@/components/dashboard/card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";

export default function Invoice() {
  const { orderId } = useParams<{ orderId: string }>();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: order } = await supabase
        .from("orders")
        .select("status, payment")
        .eq("id", orderId)
        .single();

      const { data: webhook } = await supabase
        .from("payment_webhooks")
        .select("payload")
        .eq("order_id", orderId)
        .single();

      if (webhook) {
        const payload =
          typeof webhook.payload === "string"
            ? JSON.parse(webhook.payload)
            : webhook.payload;

        const data = {
          ...order,
          ...payload,
        };

        setInvoice(data);
      }
    };

    fetchOrder();
  }, [orderId]);

  const totalAmount = invoice?.item_details?.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied");
  };

  return (
    <div className="flex justify-center items-center py-10 px-4 bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="relative">
          <CardTitle>Invoice</CardTitle>
          <CardDescription className="absolute right-5 top-5">
            {invoice?.status === "PAID" ? (
              <Badge className="w-fit bg-green-500 text-white">Paid</Badge>
            ) : (
              <Badge className="w-fit">Pending</Badge>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="border-none w-full">
          {/* Tabel Item */}
          <div className="overflow-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left p-2">Item</th>
                  <th className="text-center p-2">Qty</th>
                  <th className="text-right p-2">Harga</th>
                  <th className="text-right p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.item_details?.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="p-2">{item.name}</td>
                    <td className="text-center p-2">{item.quantity}</td>
                    <td className="text-right p-2">
                      Rp{item.price.toLocaleString()}
                    </td>
                    <td className="text-right p-2">
                      Rp{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td className="p-2" colSpan={3}>
                    Total
                  </td>
                  <td className="text-right p-2">
                    Rp{totalAmount?.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <Separator />

          {/* Info Pembayaran */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Payment Info</h3>
            <p>
              <span className="font-medium">Method:</span>{" "}
              {invoice?.payment_type === "bank_transfer"
                ? "Bank Transfer"
                : invoice?.payment_type}
            </p>
            {invoice?.bank_transfer?.bank && (
              <p>
                <span className="font-medium">Bank:</span>{" "}
                {invoice.bank_transfer.bank.toUpperCase()}
              </p>
            )}
            {invoice?.payment && (
              <p>
                <span className="font-medium">VA Number:</span>{" "}
                {invoice.payment}
                <button
                  onClick={() => copyText(invoice.payment)}
                  className="ml-3"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </p>
            )}
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Customer Info</h3>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {invoice?.customer_details?.first_name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {invoice?.customer_details?.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {invoice?.customer_details?.phone}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {invoice?.customer_details?.billing_address?.address}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
