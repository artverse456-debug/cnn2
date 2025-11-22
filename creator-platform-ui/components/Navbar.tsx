"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { useMemo } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type UserRole = "creator" | "fan" | null;

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/creator-hub", label: "Creator Hub" },
  { href: "/fan-hub", label: "Fan Hub" },
  { href: "/payments", label: "Payments" },
  { href: "/settings", label: "Settings" }
];

export function Navbar() {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const session = useAuthStore((state) => state.session);
  const clearAuth = useAuthStore((state) => state.clear);
  const isCreator = useAuthStore((state) => state.isCreator);
  const isFan = useAuthStore((state) => state.isFan);

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
      await supabaseBrowserClient.auth.signOut();
      clearAuth();
      router.push("/");
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
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white"
              >
                <span className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-black/40">
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50">{role}</span>
                  <span className="text-sm font-semibold text-white">{profile.username ?? profile.email}</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium hover:border-primary"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
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
