import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AppProviders } from "@/components/AppProviders";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";

export const metadata: Metadata = {
  title: "CreatorPulse · Next.js 14 Creator Platform",
  description: "Responsive Next.js 14 UI für Creator-Challenges, Rewards und Payments.",
  icons: [{ rel: "icon", url: "/logo.svg" }]
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <html lang="de">
      <body className="bg-[#05060a] text-white">
        <div className="min-h-screen">
          <AppProviders initialSession={session ?? null}>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
