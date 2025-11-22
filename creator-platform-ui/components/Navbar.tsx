"use client";

import Link from "next/link";
import { supabaseAuthClient } from "@/lib/supabaseClient";
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
  const loading = useAuthStore((state) => state.loading);
  const session = useAuthStore((state) => state.session);
  const clearAuth = useAuthStore((state) => state.clear);

  const filteredLinks = links.filter((link) => {
    if (link.label === "Creator Hub") return role === "creator";
    if (link.label === "Fan Hub") return role === "fan";
    return !loading;
  });

  const handleLogout = async () => {
    try {
      await supabaseAuthClient.signOut();
      clearAuth();
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
          {session ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium hover:border-primary"
            >
              Logout
            </button>
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
