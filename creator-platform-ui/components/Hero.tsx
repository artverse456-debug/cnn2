import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-light">Creator & Fan OS</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
          Monetisiere <span className="text-gradient">Challenges</span> und pflege lebendige Communities
        </h1>
        <p className="mt-6 text-lg text-white/70">
          Kuratiere Wettbewerbe, verteile Rewards und sammle Fanpunkte – alles in einem schnellen Next.js 14 Frontend.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/explore"
            className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 font-semibold shadow-soft"
          >
            Explore Creators
          </Link>
          <Link
            href="/dashboard/creator"
            className="rounded-full border border-white/20 px-8 py-3 font-semibold text-white/80 hover:border-primary"
          >
            Creator Dashboard
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8 text-sm text-white/80 shadow-2xl shadow-primary/30">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Live Challenge Stack</p>
        <div className="mt-6 space-y-4">
          {["Brief", "Fanfeed", "Rewards", "Payout"].map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-white">{step}</p>
                <p className="text-xs text-white/60">{index === 0 ? "Definiere Ziele" : index === 1 ? "Sammle Videos" : index === 2 ? "Belohne Fans" : "Schütte Gewinne aus"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
