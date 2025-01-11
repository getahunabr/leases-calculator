import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

import { NextURL } from "next/dist/server/web/next-url";

interface MiddlewareRequest extends NextRequest {
  nextUrl: NextURL;
}

export async function middleware(
  req: MiddlewareRequest
): Promise<NextResponse> {
  console.log("Middleware triggered for:", req.nextUrl.pathname);

  const token: JWT | null = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    console.log("No token found. Redirecting to:", loginUrl);
    return NextResponse.redirect(loginUrl);
  }

  console.log("Authenticated user. Token:", token);
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"], // Protect these routes
};
