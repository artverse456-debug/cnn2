import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-light">Fan-Ökonomie für Creator-Gruppen</p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
          Fanclubs, in denen <span className="text-gradient">Support belohnt</span> wird
        </h1>
        <p className="mt-6 text-lg text-white/70">
          Creator erstellen Fanclubs mit Free- oder Paid-Mitgliedschaft. Paid Fans erhalten monatliche Punkte, Engagement bringt zusätzliche Punkte und alles kann gegen Creator-Rewards wie Merch oder Shoutouts eingelöst werden. Challenges bleiben ein Bonus, nicht der Hauptfokus.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 font-semibold shadow-soft"
          >
            Creator werden
          </Link>
          <Link
            href="/login"
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
            { title: "Fanclub erstellen", description: "Creator starten Gruppen mit Free oder Paid Optionen" },
            { title: "Punkte verteilen", description: "Paid Fans erhalten monatliche Punkte als Start" },
            { title: "Engagement belohnen", description: "Aktive Fans sammeln zusätzliche Punkte" },
            { title: "Rewards einlösen", description: "Punkte gegen Merch, Shoutouts oder Drops tauschen" }
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
