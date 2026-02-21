import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
      const roles = await db.role.findMany(); 
      return NextResponse.json(roles); 
    } catch (error) {
      console.error("Error fetching roles:", error);
      return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
    }
  }

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, menus } = body;

    if (!id || !menus) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updatedRole = await db.role.update({
      where: { id },
      data: { menus: menus.join(",") }, // Convert array to comma-separated string
    });

    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
