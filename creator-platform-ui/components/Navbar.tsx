"use client";

import Link from "next/link";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import { BrandLogo } from "./BrandLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { useMemo, useState } from "react";

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
  const pointsBalance = useAuthStore((state) => state.profile?.points_balance ?? state.profile?.points ?? 0);
  const [showDropdown, setShowDropdown] = useState(false);

  const avatarUrl = useMemo(() => {
    if (profile?.avatar_url) return profile.avatar_url;
    return "/logo.svg";
  }, [profile?.avatar_url]);

  const filteredLinks = useMemo(() => {
    if (loading || !session || !role) return [];

    if (role === "creator") return links.filter((link) => link.label === "Creator Hub");
    if (role === "fan") return links.filter((link) => link.label === "Fan Hub");

    return [];
  }, [loading, session, role]);

  const handleLogout = async () => {
    try {
      await supabaseAuthClient.signOut();
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
        {session ? (
          <nav className="hidden gap-6 text-sm text-white/80 md:flex">
            {loading ? (
              <div className="h-4 w-20 rounded-full bg-white/10" aria-hidden />
            ) : (
              filteredLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white transition">
                  {link.label}
                </Link>
              ))
            )}
          </nav>
        ) : null}
        <div className="flex items-center gap-3">
          {session && profile ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white"
              >
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {pointsBalance} Punkte
                </span>
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
                    href="/dashboard/creator"
                    className="block rounded-xl px-3 py-2 text-white/80 hover:bg-white/5"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profil
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
