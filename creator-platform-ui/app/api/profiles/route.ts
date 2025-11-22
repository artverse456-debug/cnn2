import { NextRequest, NextResponse } from "next/server";
import { serverCreateProfile, usernameFromEmail, type UserRole } from "@/lib/profileService";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { userId?: string; email?: string | null; role?: UserRole };

  if (!body.userId || !body.role) {
    return NextResponse.json({ error: "Missing user or role" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const existing = await admin.from("profiles").select("*").eq("id", body.userId).maybeSingle();

  if (existing.data) {
    return NextResponse.json({ profile: existing.data });
  }

  const user = {
    id: body.userId,
    email: body.email ?? null,
    user_metadata: { role: body.role },
  } as unknown as Parameters<typeof serverCreateProfile>[0];

  const profile = await serverCreateProfile(user, body.role);

  if (!profile) {
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }

  return NextResponse.json({ profile: { ...profile, username: profile.username ?? usernameFromEmail(body.email) } });
}
