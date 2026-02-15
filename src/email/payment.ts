import { formatRupiah } from "@/lib/utils";

export function paymentSuccessTemplate(orderId: string, total: string) {
  return `
  <div style="background:#f3f4f6;padding:40px;font-family:Arial,sans-serif;">
    <div style="max-width:520px;margin:auto;background:white;border-radius:8px;padding:24px;">
      
      <h2 style="margin:0 0 16px 0;">Payment received</h2>
      
      <p style="margin:0 0 12px 0;">
        Thank you for your order. Your payment has been successfully confirmed.
      </p>

      <div style="background:#f9fafb;padding:12px;border-radius:6px;margin:16px 0;">
        <b>Order ID:</b> ${orderId} <br/>
        <b>Total:</b> <span>Rp</span> ${formatRupiah(Number(total))}
      </div>

      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/payment/${orderId}"
         style="display:inline-block;margin-top:16px;padding:10px 16px;
         background:yellow;text-decoration:none;border-radius:32px;color:black;">
         View Order
      </a>

      <p style="font-size:12px;color:gray;margin-top:24px;">
        Yellow Store • This is an automated email
      </p>
    </div>
  </div>
  `;
}
