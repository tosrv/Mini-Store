import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";
import { paymentSuccessTemplate } from "@/email/payment";
import { shippedTemplate } from "@/email/shipped";
import { cancelledTemplate } from "@/email/cancel";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();

  const { record, old_record } = payload;

  if (!record) {
    return NextResponse.json(
      { message: "No record in payload" },
      { status: 400 },
    );
  }

  const orderId = record.id;
  const userId = record.user_id;
  const total = record.total_price;
  const type = record.status;

  // console.log("SUPABASE WEBHOOK:", { type, orderId, userId });

  if (record.status === old_record?.status) {
    return NextResponse.json({ message: "Status not changed, skipping email" });
  }

  if (!type || !orderId || !userId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", userId)
    .single();

  const userEmail = profile?.email;

  if (!profile?.email) {
    console.error("Email not found for user:", userId);
    return NextResponse.json(
      { message: "User email not found" },
      { status: 400 },
    );
  }

  let html = "";
  let subject = "";
  const tracking = "Tracking not available yet";

  switch (type) {
    case "PAID":
      html = paymentSuccessTemplate(orderId, total);
      subject = "Payment received";
      break;
    case "SHIPPED":
      html = shippedTemplate(orderId, tracking);
      subject = "Your order is on the way";
      break;
    case "CANCELLED":
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
