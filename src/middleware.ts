import { verifyAuth } from "./lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("user-token")?.value;

  //   validate the user is authenticated
  const verifiedToken =
    token &&
    (await verifyAuth(token).catch((err) => {
      console.error("message: ", err);
    }));

  if (req.nextUrl.pathname.startsWith("/login") && !verifiedToken) {
    return;
  }

  const url = req.url;

  if (url.includes("/login") && verifiedToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return;
}

// See "Matching paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path", "/api/admin/:path", "/login"],
};
