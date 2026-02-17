"use client";

import { CardContent } from "@/components/dashboard/card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatRupiah } from "@/lib/utils";
import { useOrderStore } from "@/store/order-store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/layout/Loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Invoice() {
  const orders = useOrderStore((state) => state.orders);
  const { orderId } = useParams<{ orderId: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data: order } = await supabase
          .from("orders")
          .select("payment")
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
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
      clearCart();
    };

    fetchOrder();
  }, [orderId, clearCart]);

  const totalAmount = invoice?.item_details?.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const statusColors: Record<
    "PAID" | "PENDING" | "CANCEL" | "CANCELLED" | "SHIPPED",
    string
  > = {
    PAID: "bg-green-500 hover:bg-green-500 text-white",
    PENDING: "",
    CANCEL: "bg-orange-400 hover:bg-orange-400 text-white",
    CANCELLED: "bg-red-500 hover:bg-red-500 text-white",
    SHIPPED: "bg-blue-500 hover:bg-blue-500 text-white",
  };

  const paymentStatus = orders.find((order) => order.id === orderId)?.status;

  if (loading) return <Loading />;

  return (
    <>
      {invoice ? (
        <div className="flex justify-center items-center py-10 px-4 bg-gray-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="relative">
              <CardTitle className="text-xl">Invoice</CardTitle>
              <CardDescription className="absolute right-5 top-5">
                <Badge
                  className={`w-fit ${statusColors[paymentStatus as keyof typeof statusColors]}`}
                >
                  {paymentStatus}
                </Badge>
              </CardDescription>
            </CardHeader>

            <CardContent className="border-none w-full">
              {/* Tabel Item */}
              <div className="overflow-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-2">Item</th>
                      <th className="p-2">Qty</th>
                      <th className="text-left p-2">Harga</th>
                      <th className="text-left p-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.item_details?.map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="p-2">{item.name}</td>
                        <td className="text-center p-2">{item.quantity}</td>
                        <td className="text-left p-2 whitespace-nowrap">
                          Rp {formatRupiah(item.price)}
                        </td>
                        <td className="text-left p-2 whitespace-nowrap">
                          Rp {formatRupiah(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="p-2" colSpan={3}>
                        Total
                      </td>
                      <td className="text-left p-2 whitespace-nowrap">
                        Rp {formatRupiah(totalAmount)}
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
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Invoice not found
            </h1>
            <Button className="shadow-none" asChild>
              <Link href="/">Return to Shop</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
