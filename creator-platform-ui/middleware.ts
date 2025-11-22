import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "./lib/supabase/middlewareClient";

const PROTECTED_PATHS = ["/dashboard", "/settings", "/payments", "/challenges", "/creators"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(request, response);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");

  if (!session && isProtectedPath(pathname)) {
    const redirectUrl = new URL(`/auth/login?redirect_to=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (!session) return response;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
  const role = (profile?.role ?? session.user.user_metadata?.role ?? "fan") as "creator" | "fan";

  if (isAuthRoute) {
    const destination = role === "creator" ? "/dashboard/creator" : "/dashboard/fan";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (pathname.startsWith("/dashboard/creator") && role !== "creator") {
    return NextResponse.redirect(new URL("/dashboard/fan", request.url));
  }

  if (pathname.startsWith("/dashboard/fan") && role === "creator") {
    return NextResponse.redirect(new URL("/dashboard/creator", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/payments/:path*", "/challenges/:path*", "/creators/:path*", "/auth/:path*"]
};
