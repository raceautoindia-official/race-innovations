import db from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, status } = body || {};

    if (!razorpay_order_id) {
      return NextResponse.json(
        { success: false, message: "Order id is required." },
        { status: 400 }
      );
    }

    const safeStatus =
      status === "cancelled" || status === "failed" ? status : "failed";

    await db.execute(
      `UPDATE report_payments
       SET payment_status = ?
       WHERE razorpay_order_id = ?`,
      [safeStatus, String(razorpay_order_id)]
    );

    return NextResponse.json({
      success: true,
      message: `Payment marked as ${safeStatus}.`,
    });
  } catch (error) {
    console.error("Fail payment error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update payment status." },
      { status: 500 }
    );
  }
}