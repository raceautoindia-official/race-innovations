import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

const ANGLE = 30;
const COS = Math.cos((ANGLE * Math.PI) / 180);
const SIN = Math.sin((ANGLE * Math.PI) / 180);

// pdf-lib's built-in fonts can only encode WinAnsi (Latin-1) characters.
function toWinAnsi(text) {
  return String(text || "")
    .replace(/[^\x20-\x7E -ÿ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Stamps every page with a faint diagonal "Prepared for <client>" pattern
// running across the content, so it can't be painted out like a corner logo
// without damaging the charts and tables underneath, plus a small footer
// line. The stamp is vector text, so the file stays about the same size.
export async function watermarkPdf(bytes, preparedFor) {
  const client = toWinAnsi(preparedFor);
  const tileText = client
    ? `Prepared for ${client}`
    : "RACE Innovations · Confidential";
  const footerText = `${client ? `Prepared for ${client} · ` : ""}RACE Innovations · Confidential. Sharing, copying or rebranding this report is not permitted.`;

  const doc = await PDFDocument.load(bytes);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  for (const page of doc.getPages()) {
    const box = page.getCropBox();
    const left = box.x;
    const bottom = box.y;
    const right = box.x + box.width;
    const top = box.y + box.height;

    const size = Math.max(12, Math.min(box.width, box.height) / 26);
    const textWidth = bold.widthOfTextAtSize(tileText, size);
    const stepU = textWidth + size * 4;
    const stepV = size * 5;
    const reach = Math.hypot(box.width, box.height);
    const cx = left + box.width / 2;
    const cy = bottom + box.height / 2;

    // Lay the text out on a grid in the rotated frame (u along the text,
    // v across it), offsetting alternate rows, and keep the copies that
    // land on the page.
    for (let row = Math.floor(-reach / stepV); row * stepV <= reach; row++) {
      const v = row * stepV;
      const shift = Math.abs(row % 2) * (stepU / 2);
      for (let u = -reach - shift; u <= reach; u += stepU) {
        const x = cx + u * COS - v * SIN;
        const y = cy + u * SIN + v * COS;
        const endX = x + textWidth * COS;
        const endY = y + textWidth * SIN;
        if (endX < left || x > right || endY < bottom || y > top + size) {
          continue;
        }
        page.drawText(tileText, {
          x,
          y,
          size,
          font: bold,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.14,
          rotate: degrees(ANGLE),
        });
      }
    }

    const margin = Math.max(8, box.width * 0.02);
    const maxFooterWidth = box.width - margin * 2;
    let footerSize = 8;
    const footerWidth = regular.widthOfTextAtSize(footerText, footerSize);
    if (footerWidth > maxFooterWidth) {
      footerSize *= maxFooterWidth / footerWidth;
    }
    page.drawText(footerText, {
      x: left + margin,
      // Close to the edge, below the border most report templates draw.
      y: bottom + footerSize * 0.6,
      size: footerSize,
      font: regular,
      color: rgb(0.35, 0.35, 0.35),
      opacity: 0.85,
    });
  }

  return doc.save();
}
