import db from "./db";

let flipbookColumnsEnsured = false;

// Watermark settings on the `pdf` (flipbook) table. Auto-created so no manual
// migration is needed on any environment.
//   watermark            1 = serve only the stamped copy
//   prepared_for         client name printed in the stamp
//   watermarked_content  S3 key of the stamped copy
export async function ensureFlipbookColumns() {
  if (flipbookColumnsEnsured) return;
  try {
    const [cols] = await db.query(`SHOW COLUMNS FROM pdf`);
    const existing = new Set(cols.map((c) => c.Field));

    if (!existing.has("watermark")) {
      await db.query(
        `ALTER TABLE pdf ADD COLUMN watermark TINYINT(1) NOT NULL DEFAULT 0`
      );
    }
    if (!existing.has("prepared_for")) {
      await db.query(`ALTER TABLE pdf ADD COLUMN prepared_for VARCHAR(255) NULL`);
    }
    if (!existing.has("watermarked_content")) {
      await db.query(
        `ALTER TABLE pdf ADD COLUMN watermarked_content VARCHAR(500) NULL`
      );
    }

    flipbookColumnsEnsured = true;
  } catch (err) {
    console.error("ensureFlipbookColumns failed:", err);
  }
}

// What the public flipbook API may reveal: never the password hash, and for
// a watermarked flipbook never the original file, only the stamped copy.
// The S3 bucket can't be listed, so an unpublished key can't be found.
export function toPublicFlipbook(row) {
  const { password, watermarked_content, ...rest } = row;
  const watermark = Number(row.watermark) === 1;
  return {
    ...rest,
    watermark: watermark ? 1 : 0,
    content: watermark ? watermarked_content || "" : row.content,
  };
}
