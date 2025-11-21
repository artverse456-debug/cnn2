import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-light">Fan-Ökonomie für Creator-Gruppen</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
          Baue aktive Communities, die <span className="text-gradient">Support belohnen</span>
        </h1>
        <p className="mt-6 text-lg text-white/70">
          Creator starten Gruppen, definieren Rewards und Preise. Fans treten free oder premium bei, sammeln Punkte durch Engagement und lösen sie für echte Gegenwerte ein.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/auth/login"
            className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 font-semibold shadow-soft"
          >
            Creator werden
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-white/20 px-8 py-3 font-semibold text-white/80 hover:border-primary"
          >
            Als Fan starten
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8 text-sm text-white/80 shadow-2xl shadow-primary/30">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">CreatorPulse Fan-Economy Stack</p>
        <div className="mt-6 space-y-4">
          {[
            { title: "Beitreten", description: "Fans treten free oder premium Gruppen bei" },
            { title: "Punkte sammeln", description: "Interaktionen und Mitgliedschaften bringen Points" },
            { title: "Rewards einlösen", description: "Points werden gegen Merch, Shoutouts, Drops getauscht" },
            { title: "Creator-Einkommen", description: "Mitgliedsbeiträge + Reward-Käufe landen beim Creator" }
          ].map((step, index) => (
            <div key={step.title} className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-white">{step.title}</p>
                <p className="text-xs text-white/60">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
