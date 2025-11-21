"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseAuthClient } from "@/lib/supabaseClient";
import { BrandLogo } from "./BrandLogo";

type UserRole = "creator" | "fan" | null;

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard/creator", label: "Creator Hub" },
  { href: "/dashboard/fan", label: "Fan Hub" },
  { href: "/payments", label: "Payments" },
  { href: "/settings", label: "Settings" }
];

export function Navbar() {
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = supabaseAuthClient.getSession();
    const storedRole = (session?.user?.user_metadata?.role as UserRole) ?? null;

    setRole(storedRole);
    setIsAuthenticated(!!session);

    let isMounted = true;

    const fetchUser = async () => {
      const { data } = await supabaseAuthClient.getUser();
      if (!isMounted) return;

      const userRole = (data.user?.user_metadata?.role as UserRole) ?? null;
      setRole(userRole);
      setIsAuthenticated(!!data.user);
    };

    fetchUser();

    const unsubscribe = supabaseAuthClient.onAuthStateChange((updatedSession) => {
      const nextRole = (updatedSession?.user?.user_metadata?.role as UserRole) ?? null;
      setRole(nextRole);
      setIsAuthenticated(!!updatedSession);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const filteredLinks = links.filter((link) => {
    if (role === "creator" && link.label === "Fan Hub") return false;
    if (role === "fan" && link.label === "Creator Hub") return false;
    return true;
  });

  const handleLogout = async () => {
    try {
      await supabaseAuthClient.signOut();
      setRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
          {isAuthenticated ? (
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
