// import { NextResponse } from "next/server";
// import db from "@/lib/db";
// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { s3Client } from "@/lib/s3Client";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import bcrypt from "bcryptjs"; 

// function generateSlug(title) {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-") 
//     .replace(/-+/g, "-");
// }
// function hashPassword(password) {
//   const saltRounds = 10; 
//   return bcrypt.hashSync(password, saltRounds); 
// }

// // GET
// export async function GET() {
//   try {
//     const [rows] = await db.query("SELECT * FROM pdf");
//     return NextResponse.json(rows, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching PDFs:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // POST
// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("pdf");
//     const title = formData.get("title");
//     const password = formData.get("password"); 
//     const page_format = formData.get("page_format"); 
//     if (!file || typeof file === "string") {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }
//     const hashedPassword = password ? hashPassword(password) : null;

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const originalName = file.name;
//     const fileExtension = path.extname(originalName);
//     const uuidName = `${uuidv4()}${fileExtension}`;
//     const titleSlug = generateSlug(title);

//     const bucketName = process.env.AWS_S3_BUCKET_NAME;
//     const s3Key = `uploads/pdfs/${uuidName}`; 

//     const uploadParams = {
//       Bucket: bucketName,
//       Key: s3Key,
//       Body: buffer,
//       ContentType: file.type,
//     };

//     await s3Client.send(new PutObjectCommand(uploadParams));

//     const [result] = await db.query(
//       "INSERT INTO pdf (content, title, title_slug, password,page_format) VALUES (?, ?, ?,?, ?)", 
//       [s3Key, title, titleSlug, hashedPassword , page_format] 
//     );

//     return NextResponse.json(
//       {
//         message: "PDF uploaded successfully!",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PUT


// export async function PUT(req) {
//   try {
//     const formData = await req.formData();
//     const id = formData.get("id");
//     const file = formData.get("pdf");
//     const title = formData.get("title");
//     const password = formData.get("password");
//     const page_format = formData.get("page_format");
//     console.log(page_format);
    

//     if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
//     if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

//     const titleSlug = generateSlug(title);
//     let hashedPassword = password ? await bcrypt.hash(password, 10) : null;
//     let newFilename = null;

//     // Handle file upload if a new file is provided
//     if (file && typeof file !== "string") {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const originalName = file.name;
//       const fileExtension = path.extname(originalName);
//       const uuidName = `${uuidv4()}${fileExtension}`;
//       newFilename = `uploads/pdfs/${uuidName}`; // Same format as POST

//       const uploadParams = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: newFilename,
//         Body: buffer,
//         ContentType: file.type,
//       };

//       await s3Client.send(new PutObjectCommand(uploadParams));
//     }

//     // Build dynamic SQL query
//     let updateQuery = "UPDATE pdf SET title = ?, title_slug = ?";
//     const updateParams = [title, titleSlug];

//     if (newFilename) {
//       updateQuery += ", content = ?";
//       updateParams.push(newFilename);
//     }

//     if (hashedPassword) {
//       updateQuery += ", password = ?";
//       updateParams.push(hashedPassword);
//     }

//     if (page_format) {
//       updateQuery += ", page_format = ?";
//       updateParams.push(page_format);
//     }

//     updateQuery += " WHERE id = ?";
//     updateParams.push(id);

//     await db.query(updateQuery, updateParams);

//     return NextResponse.json(
//       {
//         message: "PDF updated successfully!",
//         content: newFilename,
//         title,
//         title_slug: titleSlug,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("PUT Error:", error);
//     return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
//   }
// }




// // DELETE
// export async function DELETE(req) {
//   const { searchParams } = new URL(req.url);
//   const filename = searchParams.get("filename");

//   if (!filename) {
//     return NextResponse.json({ error: "Filename is required" }, { status: 400 });
//   }

//   try {
//     const [rows] = await db.query("SELECT * FROM pdf WHERE content = ?", [filename]);
//     if (rows.length === 0) {
//       return NextResponse.json({ error: "PDF not found in DB" }, { status: 404 });
//     }

//     const filePath = path.join(process.cwd(), "public", "pdf", filename);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     await db.query("DELETE FROM pdf WHERE content = ?", [filename]);

//     return NextResponse.json({ message: "PDF deleted successfully!" }, { status: 200 });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import bcrypt from "bcryptjs";
import libre from "libreoffice-convert";
import path from "path";

// Helpers
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const config = { api: { bodyParser: false } };

// ── GET ────────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM pdf");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── POST ───────────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf");
    const title = formData.get("title");
    const password = formData.get("password");
    const page_format = formData.get("page_format");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read buffer & detect extension
    let buffer = Buffer.from(await file.arrayBuffer());
    let ext = path.extname(file.name).toLowerCase();
    let mime = file.type;

    // If PPT/PPTX/PPS/PPSX → convert to PDF
    if ([".ppt", ".pptx", ".pps", ".ppsx"].includes(ext)) {
      buffer = await new Promise((resolve, reject) => {
        libre.convert(buffer, ".pdf", undefined, (err, done) => {
          if (err) return reject(err);
          resolve(done);
        });
      });
      ext = ".pdf";
      mime = "application/pdf";
    }

    // Prepare S3 key
    const uuidName = `${uuidv4()}${ext}`;
    const s3Key = `uploads/pdfs/${uuidName}`;

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: mime,
      })
    );

    // Insert DB record
    const slug = generateSlug(title);
    const hashed = password ? bcrypt.hashSync(password, 10) : null;
    await db.query(
      `INSERT INTO pdf (content, title, title_slug, password, page_format)
       VALUES (?, ?, ?, ?, ?)`,
      [s3Key, title, slug, hashed, page_format]
    );

    return NextResponse.json({ message: "File uploaded!" }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── PUT ────────────────────────────────────────────────────────────────────────
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const file = formData.get("pdf");
    const title = formData.get("title");
    const password = formData.get("password");
    const page_format = formData.get("page_format");

    if (!id || !title) {
      return NextResponse.json({ error: "Missing id or title" }, { status: 400 });
    }

    const slug = generateSlug(title);
    const updates = [];
    const params = [title, slug];

    // Handle new file if provided
    if (file && typeof file !== "string") {
      let buffer = Buffer.from(await file.arrayBuffer());
      let ext = path.extname(file.name).toLowerCase();
      let mime = file.type;

      if ([".ppt", ".pptx", ".pps", ".ppsx"].includes(ext)) {
        buffer = await new Promise((resolve, reject) => {
          libre.convert(buffer, ".pdf", undefined, (err, done) => {
            if (err) return reject(err);
            resolve(done);
          });
        });
        ext = ".pdf";
        mime = "application/pdf";
      }

      const uuidName = `${uuidv4()}${ext}`;
      const s3Key = `uploads/pdfs/${uuidName}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: mime,
        })
      );

      updates.push("content = ?");
      params.push(s3Key);
    }

    // Handle password change
    if (password) {
      const hashed = bcrypt.hashSync(password, 10);
      updates.push("password = ?");
      params.push(hashed);
    }

    // Handle page_format
    if (page_format) {
      updates.push("page_format = ?");
      params.push(page_format);
    }

    // Build & run UPDATE
    const updateSql = `
      UPDATE pdf
      SET title = ?, title_slug = ?
      ${updates.length ? ", " + updates.join(", ") : ""}
      WHERE id = ?`;
    params.push(id);

    await db.query(updateSql, params);

    return NextResponse.json({ message: "File updated!" }, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── DELETE ─────────────────────────────────────────────────────────────────────
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    await db.query("DELETE FROM pdf WHERE content = ?", [filename]);

    return NextResponse.json({ message: "Deleted!" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
