"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";

type UserRole = "creator" | "fan" | null;

type SupabaseUser = {
  user_metadata?: {
    role?: string;
  };
} | null;

type SupabaseUserResponse = {
  data: {
    user: SupabaseUser;
  };
  error: Error | null;
};

function createSupabaseAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let projectRef: string | null = null;

  if (supabaseUrl) {
    try {
      projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    } catch (error) {
      console.error("Invalid Supabase URL", error);
    }
  }

  async function getAccessToken() {
    if (typeof window === "undefined" || !projectRef) return null;

    const authData = localStorage.getItem(`sb-${projectRef}-auth-token`);

    if (!authData) return null;

    try {
      const parsedAuth = JSON.parse(authData);
      return parsedAuth?.currentSession?.access_token ?? null;
    } catch (error) {
      console.error("Failed to parse Supabase auth token", error);
      return null;
    }
  }

  return {
    auth: {
      async getUser(): Promise<SupabaseUserResponse> {
        if (!supabaseUrl || !supabaseAnonKey) {
          return { data: { user: null }, error: new Error("Supabase credentials missing") };
        }

        const accessToken = await getAccessToken();

        if (!accessToken) return { data: { user: null }, error: null };

        try {
          const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              apikey: supabaseAnonKey
            }
          });

          if (!response.ok) {
            return { data: { user: null }, error: new Error("Failed to load Supabase user") };
          }

          const user = (await response.json()) as SupabaseUser;
          return { data: { user }, error: null };
        } catch (error) {
          console.error("Error fetching Supabase user", error);
          return { data: { user: null }, error: error as Error };
        }
      }
    }
  };
}

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard/creator", label: "Creator Hub" },
  { href: "/dashboard/fan", label: "Fan Hub" },
  { href: "/payments", label: "Payments" },
  { href: "/settings", label: "Settings" }
];

const supabase = createSupabaseAuthClient();

export function Navbar() {
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    let isActive = true;

    const fetchRole = async () => {
      const { data } = await supabase.auth.getUser();

      if (!isActive) return;

      const userRole = (data.user?.user_metadata?.role as UserRole) ?? null;

      setRole(userRole);
    };

    fetchRole();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredLinks = links.filter((link) => {
    if (role === "creator" && link.label === "Fan Hub") return false;
    if (role === "fan" && link.label === "Creator Hub") return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <BrandLogo />
        <nav className="hidden gap-6 text-sm text-white/80 md:flex">
          {filteredLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium hover:border-primary"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="hidden rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/40 sm:block"
          >
            Join Beta
          </Link>
        </div>
      </div>
    </header>
  );
}
