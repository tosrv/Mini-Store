import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";
import { paymentSuccessTemplate } from "@/email/payment";
import { shippedTemplate } from "@/email/shipped";
import { cancelledTemplate } from "@/email/cancel";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { type, orderId, total, userEmail } = await req.json();

  if (!type || !orderId || !userEmail) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  let html = "";
  let subject = "";
  const tracking = "Tracking not available yet";

  switch (type) {
    case "payment":
      html = paymentSuccessTemplate(orderId, total);
      subject = "Payment received";
      break;
    case "shipped":
      html = shippedTemplate(orderId, tracking);
      subject = "Your order is on the way";
      break;
    case "cancelled":
      html = cancelledTemplate(orderId);
      subject = "Order cancelled";
      break;
    default:
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  try {
    await transporter.sendMail({
      from: '"Yellow Store" <rahmattomyapriliyanto@gmail.com>',
      to: userEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Email sent successfully" });
}
