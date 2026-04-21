import db from "../../../../lib/db";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      report_id,
      report_title,
      amount,
      customer_name,
      customer_email,
      customer_phone,
    } = body || {};

    const parsedAmount = Number(amount);

    if (!report_id) {
      return NextResponse.json(
        { success: false, message: "Report id is required." },
        { status: 400 }
      );
    }

    if (!report_title || !String(report_title).trim()) {
      return NextResponse.json(
        { success: false, message: "Report title is required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount." },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_email || !customer_phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and phone are required.",
        },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Razorpay keys are missing.",
        },
        { status: 500 }
      );
    }

    const currency = "USD";

    const order = await razorpay.orders.create({
      amount: Math.round(parsedAmount * 100),
      currency,
      receipt: `report_${Date.now()}`,
      notes: {
        report_id: String(report_id || ""),
        report_title: String(report_title || ""),
        customer_email: String(customer_email || ""),
      },
    });

    await db.execute(
      `INSERT INTO report_payments
      (
        report_id,
        report_title,
        amount,
        currency,
        customer_name,
        customer_email,
        customer_phone,
        razorpay_order_id,
        payment_status,
        payment_method
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(report_id || ""),
        String(report_title || ""),
        parsedAmount,
        currency,
        String(customer_name || ""),
        String(customer_email || ""),
        String(customer_phone || ""),
        String(order.id),
        "created",
        "razorpay",
      ]
    );

    return NextResponse.json({
      success: true,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? error?.message || "Failed to create payment order."
            : "Failed to create payment order.",
      },
      { status: 500 }
    );
  }
}