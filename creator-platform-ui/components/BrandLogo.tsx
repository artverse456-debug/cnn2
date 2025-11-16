import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center text-white font-semibold">
        CP
      </div>
      <div className="leading-4">
        <p className="font-semibold tracking-wide">CreatorPulse</p>
        <p className="text-xs text-muted">Beta access</p>
      </div>
    </Link>
  );
}
