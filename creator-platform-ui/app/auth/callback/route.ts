import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServerClient";

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(request.url);

  if (error) {
    return NextResponse.redirect(new URL("/auth/login?error=callback", request.url));
  }

  const { data: userData } = await supabase.auth.getUser();
  const role = (userData.user?.user_metadata as { role?: string } | null)?.role;
  const destination = role === "creator" ? "/creator-hub" : "/fan-hub";

  if (!data.session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
