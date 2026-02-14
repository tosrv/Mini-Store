"use client";

import { DataTable } from "@/components/dashboard/DataTable";
import PageTitle from "@/components/dashboard/PageTitle";
import { createOrderColums } from "@/components/columns/OrderColumn";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useOrderStore } from "@/store/order-store";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatRupiah } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const orders = useOrderStore((state) => state.orders);
  const handleCancel = async (id: string) => {
    if (!id) return;

    toast((t) => (
      <div className="flex flex-col gap-3">
        <span>Are you sure you want to cancel this order?</span>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="shadow-none"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={async () => {
              toast.dismiss(t.id);
              await supabase
                .from("orders")
                .update({ status: "CANCELLED" })
                .eq("id", id);
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    ));
  };

  const handleShipped = async (id: string) => {
    if (!id) return;

    toast((t) => (
      <div className="flex flex-col gap-3">
        <span>Are you sure you want to mark this order as shipped?</span>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="shadow-none"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </Button>

          <Button
            onClick={async () => {
              toast.dismiss(t.id);
              await supabase
                .from("orders")
                .update({ status: "SHIPPED" })
                .eq("id", id);
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    ));
  };

  const handleDetails = async (id: string) => {
    if (!id) return;

    const { data: order } = await supabase
      .from("orders")
      .select("status, payment, total_price")
      .eq("id", id)
      .single();

    const { data: webhook } = await supabase
      .from("payment_webhooks")
      .select("payload")
      .eq("order_id", id)
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

      setDetails(data);
    }

    setOpenDrawer(true);
  };

  const columns = useMemo(
    () => createOrderColums(handleCancel, handleShipped, handleDetails),
    [],
  );

  const statusColors: Record<
    "PAID" | "PENDING" | "CANCELLED" | "SHIPPED",
    string
  > = {
    PAID: "bg-green-500 hover:bg-green-500 text-white",
    PENDING: "",
    CANCELLED: "bg-red-500 hover:bg-red-500 text-white",
    SHIPPED: "bg-blue-500 hover:bg-blue-500 text-white",
  };

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Orders" />
      <DataTable columns={columns} data={orders} />

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
        <DrawerContent className="h-screen w-full sm:max-w-md ml-auto rounded-none px-5">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle className="text-xl">Order Details</DrawerTitle>
            <Badge
              className={`w-fit ${statusColors[details?.status as keyof typeof statusColors]}`}
            >
              {details?.status}
            </Badge>
          </DrawerHeader>
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
                {details?.item_details?.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="p-2">{item.name}</td>
                    <td className="text-center p-2">{item.quantity}</td>
                    <td className="text-left p-2">
                      Rp {formatRupiah(item.price)}
                    </td>
                    <td className="text-left p-2">
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
                  <td className="text-left p-2">
                    Rp {formatRupiah(details?.total_price)}
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
              {details?.payment_type === "bank_transfer"
                ? "Bank Transfer"
                : details?.payment_type}
            </p>
            {details?.bank_transfer?.bank && (
              <p>
                <span className="font-medium">Bank:</span>{" "}
                {details.bank_transfer.bank.toUpperCase()}
              </p>
            )}
            {details?.payment && (
              <p>
                <span className="font-medium">VA Number:</span>{" "}
                {details.payment}
              </p>
            )}
          </div>

          <Separator className="mt-4" />

          {/* Customer Info */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Customer Info</h3>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {details?.customer_details?.first_name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {details?.customer_details?.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {details?.customer_details?.phone}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {details?.customer_details?.billing_address?.address}
            </p>
          </div>
          <DrawerFooter className="flex flex-row gap-5">
            <Button
              onClick={() => setOpenDrawer(false)}
              variant="outline"
              className="shadow-none"
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
