import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "race@123";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    
    return payload; 
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const decoded = await verifyToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  const role = decoded.role; 
  if (role === "admin") {
    return NextResponse.next();
  }
  if (role === "content_creator") {
    if (
      pathname.startsWith("/admin/pdf") ||
      pathname.startsWith("/admin/blog")
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
  return NextResponse.redirect(new URL("/unauthorized", req.url));
}

export const config = {
  matcher: ["/admin/:path*"], 
};
