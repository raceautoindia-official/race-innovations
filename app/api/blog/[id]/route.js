import { NextResponse } from "next/server";
import db from "@/lib/db";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";


function generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") 
      .replace(/-+/g, "-");
  }


const uploadFile = async (file) => {
  if (!file || typeof file === "string") return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const uuidName = `${uuidv4()}${ext}`;
  const s3Key = `uploads/${uuidName}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key,
    Body: buffer,
    ContentType: file.type,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return s3Key;
};

// GET
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const [rows] = await db.query("SELECT * FROM blog WHERE id = ?", [id]);

    if (!rows.length) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// POST
export async function POST(req) {
    try {
      const formData = await req.formData();
      const title = formData.get("title");
      const titleSlug = generateSlug(title); 
  
      const fields = {
        title,
        author: formData.get("author"),
        date: formData.get("date"),
        description: formData.get("description"),
        content: formData.get("content"),
        key_words: formData.get("key_words"),
        title_slug: titleSlug, 
      };
  
      const thumbnail = formData.get("thumbnail_image");
      const contentImage = formData.get("content_image");
  
      const thumbnailKey = await uploadFile(thumbnail);
      const contentImageKey = await uploadFile(contentImage);
  
      const [result] = await db.query(
        `INSERT INTO blog 
          (title, author, date, description, content, key_words, title_slug, thumbnail_image, content_image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fields.title,
          fields.author,
          fields.date,
          fields.description,
          fields.content,
          fields.key_words,
          fields.title_slug,
          thumbnailKey,
          contentImageKey,
        ]
      );
  
      return NextResponse.json({ message: "Blog created!" }, { status: 200 });
    } catch (error) {
      console.error("POST error:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
  }
  

// PUT
export async function PUT(req, context) {
    try {
      const id = context.params.id;
      if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
  
      const formData = await req.formData();
  
      const fields = {
        title: formData.get("title"),
        author: formData.get("author"),
        date: formData.get("date"),
        description: formData.get("description"),
        content: formData.get("content"),
        key_words: formData.get("key_words"),
        title_slug: formData.get("title_slug"),
      };
  
      const thumbnail = formData.get("thumbnail_image");
      const contentImage = formData.get("content_image");
  
      const thumbnailKey = thumbnail && typeof thumbnail.name === "string"
        ? await uploadFile(thumbnail)
        : null;
  
      const contentImageKey = contentImage && typeof contentImage.name === "string"
        ? await uploadFile(contentImage)
        : null;
  
      let updateQuery = `UPDATE blog SET 
        title = ?, author = ?, date = ?, description = ?, content = ?, 
        key_words = ?, title_slug = ?`;
      const paramsArr = [
        fields.title,
        fields.author,
        fields.date,
        fields.description,
        fields.content,
        fields.key_words,
        fields.title_slug,
      ];
  
      if (thumbnailKey) {
        updateQuery += ", thumbnail_image = ?";
        paramsArr.push(thumbnailKey);
      }
  
      if (contentImageKey) {
        updateQuery += ", content_image = ?";
        paramsArr.push(contentImageKey);
      }
  
      updateQuery += " WHERE id = ?";
      paramsArr.push(id);
  
      await db.query(updateQuery, paramsArr);
  
      return NextResponse.json({ message: "Blog updated!" }, { status: 200 });
    } catch (error) {
      console.error("PUT error:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
  }
  
 
  
  
  
  
  
  
  
  
  

// DELETE
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await db.query("DELETE FROM blog WHERE id = ?", [id]);

    return NextResponse.json({ message: "Blog deleted!" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
