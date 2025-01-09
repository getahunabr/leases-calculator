// import { NextResponse } from "next/server";
// import { auth } from "./app/_lib/auth";

// export function middleware(request) {
//   console.log(request);
//   return NextResponse.redirect(new URL("/about", request.url));
// }

// export const middleware = auth;

// export const config = {
//   matcher: ["/account"],
// };

// import { auth } from "@/app/_lib/auth";
// export const middleware = auth;

// export const config = {
//   matcher: ["/Dashboard"],
// };

// import { withAuth } from "next-auth/middleware";
// export default withAuth({
//   pages: {
//     signIn: "/auth/login",
//   },
// });
// export const config = {
//   matcher: ["/protected/Dashboard", "/"],
// };
////////////////////////////////////////////////////////////
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log("Middleware triggered for:", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

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
