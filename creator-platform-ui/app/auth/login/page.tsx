import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold text-white">Login</h1>
      <p className="text-sm text-white/70">Dummy Login – validiert keine echten Credentials.</p>
      <form className="space-y-4">
        <label className="text-sm text-white/70">
          E-Mail
          <input className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3" type="email" placeholder="creator@pulse.io" />
        </label>
        <label className="text-sm text-white/70">
          Passwort
          <input className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3" type="password" placeholder="••••••" />
        </label>
        <button className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 font-semibold">Login</button>
      </form>
      <p className="text-xs text-white/60">
        Kein Account? <Link href="/auth/register" className="text-primary-light">Registrieren</Link>
      </p>
    </div>
  );
}
