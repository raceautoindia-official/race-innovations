import { NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
export async function PUT(req) {
    try {
      const body = await req.json();
      const { id, download } = body;
  
      if (typeof id === "undefined" || typeof download === "undefined") {
        return NextResponse.json({ error: "Missing 'id' or 'download'" }, { status: 400 });
      }
  
      const query = "UPDATE pdf SET download = ? WHERE id = ?";
      const params = [download, id];
  
      const [result] = await db.query(query, params);
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ error: "PDF not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Download status updated successfully!" }, { status: 200 });
    } catch (error) {
      console.error("Toggle Download Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }