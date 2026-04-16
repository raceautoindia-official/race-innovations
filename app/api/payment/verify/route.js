import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body || {};

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      await db.execute(
        `UPDATE report_payments
         SET payment_status = ?
         WHERE razorpay_order_id = ?`,
        ["failed", String(razorpay_order_id)]
      );

      return NextResponse.json(
        { success: false, message: "Payment verification failed." },
        { status: 400 }
      );
    }

    await db.execute(
      `UPDATE report_payments
       SET razorpay_payment_id = ?,
           razorpay_signature = ?,
           payment_status = ?,
           payment_method = ?
       WHERE razorpay_order_id = ?`,
      [
        String(razorpay_payment_id),
        String(razorpay_signature),
        "paid",
        "razorpay",
        String(razorpay_order_id),
      ]
    );

    const [rows] = await db.execute(
      `SELECT id, report_id, report_slug, report_title, customer_email, payment_status
       FROM report_payments
       WHERE razorpay_order_id = ?
       LIMIT 1`,
      [String(razorpay_order_id)]
    );

    const payment = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return NextResponse.json(
      { success: false, message: "Verification failed." },
      { status: 500 }
    );
  }
}