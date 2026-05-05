import { NextResponse } from "next/server";
import db from "../../../../lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function ensureNewsletterTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      source_page VARCHAR(500) NULL,
      status ENUM('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_newsletter_email (email),
      INDEX idx_newsletter_status (status),
      INDEX idx_newsletter_created_at (created_at)
    )
  `);
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const name = String(body?.name || "").trim().slice(0, 150) || null;
    const email = String(body?.email || "").trim().toLowerCase().slice(0, 255);
    const sourcePage =
      String(body?.source_page || body?.sourcePage || "").trim().slice(0, 500) ||
      null;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await ensureNewsletterTable();

    const [existingRows] = await db.query(
      "SELECT id, status FROM newsletter_subscribers WHERE email = ? LIMIT 1",
      [email]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      const existing = existingRows[0];

      if (existing.status === "subscribed") {
        return NextResponse.json(
          {
            success: false,
            alreadySubscribed: true,
            message: "This email is already subscribed.",
          },
          { status: 409 }
        );
      }

      await db.query(
        `UPDATE newsletter_subscribers
            SET name = COALESCE(?, name),
                source_page = COALESCE(?, source_page),
                status = 'subscribed'
          WHERE id = ?`,
        [name, sourcePage, existing.id]
      );

      return NextResponse.json({
        success: true,
        message: "Welcome back — you're subscribed again.",
      });
    }

    await db.query(
      `INSERT INTO newsletter_subscribers (name, email, source_page, status)
       VALUES (?, ?, ?, 'subscribed')`,
      [name, email, sourcePage]
    );

    return NextResponse.json({
      success: true,
      message: "Thanks for subscribing — we'll be in touch.",
    });
  } catch (error) {
    console.error("newsletter/subscribe error:", error);

    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          success: false,
          alreadySubscribed: true,
          message: "This email is already subscribed.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
