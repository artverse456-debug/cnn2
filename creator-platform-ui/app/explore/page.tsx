import { creators, featuredChallenges } from "@/lib/data";
import { SectionHeader } from "@/components/SectionHeader";
import { SearchInput } from "@/components/SearchInput";
import { FilterBar } from "@/components/FilterBar";
import { CreatorCard } from "@/components/CreatorCard";
import { ChallengeCard } from "@/components/ChallengeCard";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <SectionHeader title="Explore Creator" description="Filtere nach Kategorie, Budget oder Challenge" />
      <SearchInput />
      <FilterBar />
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
        <aside className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Featured Challenges</p>
          <div className="space-y-4">
            {featuredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} compact />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
