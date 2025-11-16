import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} CreatorPulse · Built for futuristic fandoms.</p>
        <div className="flex gap-4">
          <Link href="/settings" className="hover:text-white">
            Einstellungen
          </Link>
          <Link href="/payments" className="hover:text-white">
            Zahlungen
          </Link>
          <a href="https://github.com/artverse456-debug" target="_blank" rel="noreferrer" className="hover:text-white">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
