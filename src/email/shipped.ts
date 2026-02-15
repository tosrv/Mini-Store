export function shippedTemplate(orderId: string, tracking: string) {
  return `
  <div style="background:#f3f4f6;padding:40px;font-family:Arial,sans-serif;">
    <div style="max-width:520px;margin:auto;background:white;border-radius:8px;padding:24px;">
      
      <h2>Your order is on the way 📦</h2>

      <p>Your package has been shipped.</p>

      <div style="background:#f9fafb;padding:12px;border-radius:6px;margin:16px 0;">
        <b>Order ID:</b> ${orderId} <br/>
        <b>Tracking:</b> ${tracking}
      </div>

      <a href="${process.env.NEXT_PUBLIC_BASE_URL}"
         style="display:inline-block;margin-top:16px;padding:10px 16px;
         background:yellow;color:black;text-decoration:none;border-radius:32px;">
         Track Package
      </a>

       <p style="font-size:12px;color:gray;margin-top:24px;">
        Yellow Store • This is an automated email
      </p>
    </div>
  </div>
  `;
}
