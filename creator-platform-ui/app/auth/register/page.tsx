import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold text-white">Create Account</h1>
      <p className="text-sm text-white/70">Wähle Rolle für das Demo-Routing.</p>
      <form className="space-y-4">
        <label className="text-sm text-white/70">
          Name
          <input className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3" placeholder="Ava" />
        </label>
        <label className="text-sm text-white/70">
          Rolle
          <select className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <option className="bg-black">Creator</option>
            <option className="bg-black">Fan</option>
          </select>
        </label>
        <button className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 font-semibold">Account anlegen</button>
      </form>
      <p className="text-xs text-white/60">
        Bereits dabei? <Link href="/auth/login" className="text-primary-light">Login</Link>
      </p>
    </div>
  );
}
