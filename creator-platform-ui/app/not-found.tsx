import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
      <h1 className="text-5xl font-semibold text-white">404</h1>
      <p className="text-white/70">Diese Seite existiert nicht. Navigiere zurück zur Explore Page.</p>
      <Link href="/" className="rounded-full bg-primary/80 px-8 py-3 text-sm font-semibold">
        Zur Startseite
      </Link>
    </div>
  );
}
