"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { BrandLogo } from "./BrandLogo";
import { useAuthStore } from "@/store/useAuthStore";

type UserRole = "creator" | "fan" | null;

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard/creator", label: "Creator Hub" },
  { href: "/dashboard/fan", label: "Fan Hub" },
  { href: "/payments", label: "Payments" },
  { href: "/settings", label: "Settings" }
];

export function Navbar() {
  const role = useAuthStore((state) => state.role);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const session = useAuthStore((state) => state.session);
  const clearAuth = useAuthStore((state) => state.clear);
  const isCreator = useAuthStore((state) => state.isCreator);
  const isFan = useAuthStore((state) => state.isFan);
  const [showDropdown, setShowDropdown] = useState(false);

  const avatarUrl = useMemo(() => {
    if (profile?.avatar_url) return profile.avatar_url;
    return "/logo.svg";
  }, [profile?.avatar_url]);

  const filteredLinks = links.filter((link) => {
    if (link.label === "Creator Hub") return isCreator();
    if (link.label === "Fan Hub") return isFan();
    return !loading;
  });

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      clearAuth();
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <BrandLogo />
        <nav className="hidden gap-6 text-sm text-white/80 md:flex">
          {!loading &&
            filteredLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition">
                {link.label}
              </Link>
            ))}
        </nav>
        <div className="flex items-center gap-3">
          {session && profile ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white"
              >
                <span className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-black/40">
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50">{role}</span>
                  <span className="text-sm font-semibold text-white">{profile.username ?? profile.email}</span>
                </div>
              </button>
              {showDropdown ? (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0b0c13] p-2 text-sm shadow-2xl">
                  <Link
                    href={profile.role === "creator" ? "/dashboard/creator" : "/dashboard/fan"}
                    className="block rounded-xl px-3 py-2 text-white/80 hover:bg-white/5"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block rounded-xl px-3 py-2 text-white/80 hover:bg-white/5"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-white/80 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
