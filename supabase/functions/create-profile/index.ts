import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { record: event, data } = await req.json();
    const user = event?.user ?? data?.user;

    if (!user) {
      return new Response(
        JSON.stringify({ message: "No user payload provided" }),
        { status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ message: "Missing Supabase environment variables" }),
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const role = user.user_metadata?.role ?? "fan";
    const userId = user.id;

    const { data: existingProfile, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (selectError) {
      console.error("Error checking existing profile", selectError);
      return new Response(
        JSON.stringify({ message: "Failed to check existing profile" }),
        { status: 500 }
      );
    }

    if (existingProfile) {
      return new Response(
        JSON.stringify({ message: "Profile already exists" }),
        { status: 200 }
      );
    }

    const { error: insertError } = await supabase.from("profiles").insert({
      id: userId,
      email: user.email,
      role,
      points: 0,
    });

    if (insertError) {
      console.error("Error creating profile", insertError);
      return new Response(
        JSON.stringify({ message: "Failed to create profile" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Profile created successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error", error);
    return new Response(JSON.stringify({ message: "Unexpected error" }), {
      status: 500,
    });
  }
});
