export function cancelledTemplate(orderId: string) {
  return `
  <div style="background:#f3f4f6;padding:40px;font-family:Arial,sans-serif;">
    <div style="max-width:520px;margin:auto;background:white;border-radius:8px;padding:24px;">
      
      <h2>Order cancelled</h2>

      <p>Your order has been cancelled. If payment was made, a refund will be processed.</p>

      <div style="background:#f9fafb;padding:12px;border-radius:6px;margin:16px 0;">
        <b>Order ID:</b> ${orderId}
      </div>

       <p style="font-size:12px;color:gray;margin-top:24px;">
        Yellow Store • This is an automated email
      </p>
    </div>
  </div>
  `;
}
