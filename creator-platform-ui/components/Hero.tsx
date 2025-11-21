import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-light">Plattform für Creator Challenges</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
          CreatorPulse bündelt <span className="text-gradient">Challenges</span>, Gruppen und Rewards
        </h1>
        <p className="mt-6 text-lg text-white/70">
          Creator veröffentlichen Briefings, betreiben Gruppen und vergeben Rewards. Fans nehmen teil, sammeln Punkte und erhalten Zugang zu exklusiven Drops.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/auth/login"
            className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 font-semibold shadow-soft"
          >
            Explore Creators
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-white/20 px-8 py-3 font-semibold text-white/80 hover:border-primary"
          >
            Creator Dashboard
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8 text-sm text-white/80 shadow-2xl shadow-primary/30">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">CreatorPulse Challenge Stack</p>
        <div className="mt-6 space-y-4">
          {["Challenge", "Community", "Rewards", "Payout"].map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-white">{step}</p>
                <p className="text-xs text-white/60">{index === 0 ? "Briefing mit Punkten veröffentlichen" : index === 1 ? "Beiträge und Fanaktivität bündeln" : index == 2 ? "Exklusive Rewards freischalten" : "Einnahmen auszahlen"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
