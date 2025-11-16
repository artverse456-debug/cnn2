import { notFound } from "next/navigation";
import { featuredChallenges, creators } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const allChallenges = featuredChallenges;

export default function ChallengeDetail({ params }: { params: { id: string } }) {
  const challenge = allChallenges.find((item) => item.id === params.id) ?? notFound();
  const creator = creators.find((c) => c.challenges.some((item) => item.id === challenge.id));

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Challenge Detail</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">{challenge.title}</h1>
        <p className="mt-4 text-white/70">{challenge.description}</p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
          <span>Reward: {challenge.reward}</span>
          <span>Deadline: {challenge.deadline}</span>
          <span>Einreichungen: {challenge.entries}</span>
        </div>
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Hosted by</p>
            <p className="text-lg font-semibold text-white">{creator?.name ?? "Creator"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50">Eintritt</p>
            <p className="text-2xl font-semibold text-white">{formatCurrency(challenge.price, "EUR")}</p>
          </div>
          <button className="rounded-full bg-primary/80 px-8 py-3 text-sm font-semibold">Brief herunterladen</button>
        </div>
      </div>
      <div className="space-y-6 rounded-3xl border border-white/5 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">Fanfeed</h2>
        <div className="space-y-4 text-sm text-white/70">
          {[1, 2, 3].map((item) => (
            <article key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-white">Community Beitrag #{item}</p>
              <p className="text-xs text-white/50">Hype-Level: {90 - item * 7}%</p>
              <p className="mt-2 text-white/70">
                Fans teilen Moodboards, Motion Tests und Audio-Snippets. Alle Interaktionen sind rein Frontend-basiert.
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
