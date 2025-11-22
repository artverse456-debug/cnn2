"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { DashboardCard } from "@/components/DashboardCard";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function CreatorDashboard() {
  const { creatorBalance } = useDashboardStore();
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const loading = useAuthStore((state) => state.loading);
  const [postTitle, setPostTitle] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([
    {
      id: "1",
      title: "Neuer Trailer drop",
      image: "",
      content: "Behind-the-scenes Clip für die Community.",
    },
    {
      id: "2",
      title: "Live Q&A am Freitag",
      image: "",
      content: "Stellt eure Fragen zum nächsten Release!",
    },
    {
      id: "3",
      title: "Studio Session Recap",
      image: "",
      content: "Kurzer Recap mit Highlights aus der Session.",
    },
  ]);

  const [rewardName, setRewardName] = useState("");
  const [rewardPoints, setRewardPoints] = useState("1000");
  const [rewardId, setRewardId] = useState<string | null>(null);
  const [rewardItems, setRewardItems] = useState([
    { id: "r1", title: "Exklusiver Livestream", points: 750 },
    { id: "r2", title: "Signiertes Poster", points: 1200 },
    { id: "r3", title: "Behind-the-scenes Pack", points: 950 },
  ]);

  const [groupPrice, setGroupPrice] = useState(24);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupBanner, setGroupBanner] = useState("");

  const topMembers = useMemo(
    () => [
      { id: "m1", name: "Svenja K.", points: 4820, avatar: "https://placehold.co/40x40" },
      { id: "m2", name: "Jamal R.", points: 4510, avatar: "https://placehold.co/40x40" },
      { id: "m3", name: "Lina P.", points: 4395, avatar: "https://placehold.co/40x40" },
    ],
    []
  );

  const latestPosts = useMemo(() => posts.slice(0, 3), [posts]);

  useEffect(() => {
    if (loading) return;
    if (role === "fan") {
      router.replace("/dashboard/fan");
    }
  }, [loading, role, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-white/70">
        Rolle wird geladen...
      </div>
    );
  }

  if (!role) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-white/70">
        Profilrolle konnte nicht geladen werden.
      </div>
    );
  }

  const handlePublishPost = () => {
    if (!postTitle.trim() && !postContent.trim()) return;

    setPosts((prev) => [
      {
        id: crypto.randomUUID(),
        title: postTitle || "Unbenannter Post",
        image: postImage,
        content: postContent || "",
      },
      ...prev,
    ]);

    setPostTitle("");
    setPostImage("");
    setPostContent("");
  };

  const handleSaveReward = () => {
    if (!rewardName.trim()) return;

    setRewardItems((prev) => {
      if (rewardId) {
        return prev.map((item) =>
          item.id === rewardId ? { ...item, title: rewardName, points: Number(rewardPoints) || 0 } : item
        );
      }

      return [
        { id: crypto.randomUUID(), title: rewardName, points: Number(rewardPoints) || 0 },
        ...prev,
      ];
    });

    setRewardId(null);
    setRewardName("");
    setRewardPoints("1000");
  };

  const handleEditReward = (id: string) => {
    const item = rewardItems.find((reward) => reward.id === id);
    if (!item) return;
    setRewardId(item.id);
    setRewardName(item.title);
    setRewardPoints(String(item.points));
  };

  const handleDeleteReward = (id: string) => {
    setRewardItems((prev) => prev.filter((reward) => reward.id !== id));
    if (rewardId === id) {
      setRewardId(null);
      setRewardName("");
      setRewardPoints("1000");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <SectionHeader
        title="Creator Dashboard"
        description="Verwalte Challenges, Rewards und Abo-Preise"
        action={<span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">Saldo: {formatCurrency(creatorBalance, "EUR")}</span>}
      />

      <DashboardCard
        title="Neue Posts"
        subtitle="content"
        action={<button onClick={handlePublishPost} className="rounded-full bg-primary/80 px-4 py-2 text-sm font-semibold">Publish</button>}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-white/70">
            Titel
            <input
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2"
              placeholder="z.B. Weekly Update"
            />
          </label>
          <label className="text-sm text-white/70">
            Bild (optional)
            <input
              value={postImage}
              onChange={(e) => setPostImage(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2"
              placeholder="Image URL"
            />
          </label>
        </div>
        <label className="text-sm text-white/70">
          Text
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2"
            rows={4}
            placeholder="Was willst du teilen?"
          />
        </label>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-white">Letzte 3 Posts</p>
          {latestPosts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-white/10 px-4 py-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white">{post.title}</p>
                  {post.content && <p className="text-sm text-white/60">{post.content}</p>}
                </div>
                {post.image && <span className="text-xs text-primary-light">Bild angehängt</span>}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Rewards verwalten" subtitle="boost" action={<span className="text-sm text-white/60">{rewardItems.length} aktiv</span>}>
        <div className="space-y-3">
          {rewardItems.map((reward) => (
            <div key={reward.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
              <div>
                <p className="text-white">{reward.title}</p>
                <p className="text-xs text-white/50">{reward.points} Punkte</p>
              </div>
              <div className="flex gap-3 text-sm">
                <button className="text-primary-light" onClick={() => handleEditReward(reward.id)}>
                  Bearbeiten
                </button>
                <button className="text-white/60" onClick={() => handleDeleteReward(reward.id)}>
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <label className="text-sm text-white/70">
            Reward Name
            <input
              value={rewardName}
              onChange={(e) => setRewardName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2"
              placeholder="z.B. Meet & Greet"
            />
          </label>
          <label className="text-sm text-white/70">
            Punkte
            <input
              value={rewardPoints}
              onChange={(e) => setRewardPoints(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2"
              placeholder="1000"
            />
          </label>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={handleSaveReward} className="rounded-2xl bg-white/10 px-4 py-2 text-sm">
            Reward speichern
          </button>
        </div>
      </DashboardCard>

      <DashboardCard title="Gruppenpreis" subtitle="pricing">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-semibold text-white">€{groupPrice} <span className="text-base text-white/60">pro Monat</span></p>
          <button className="rounded-full border border-white/20 px-4 py-2 text-xs">
            Speichern
          </button>
        </div>
        <input
          type="range"
          min={5}
          max={80}
          value={groupPrice}
          onChange={(e) => setGroupPrice(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm text-white/60">Passe deinen Preis live an. Alle Updates sind rein UI-basiert.</p>
      </DashboardCard>

      <DashboardCard title="Neue Gruppe" subtitle="community" action={<button className="rounded-full border border-white/20 px-4 py-2 text-xs">Gruppe erstellen</button>}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-white/70">
            Gruppenname
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2"
              placeholder="z.B. Core Supporters"
            />
          </label>
          <label className="text-sm text-white/70">
            Bannerbild (optional)
            <input
              value={groupBanner}
              onChange={(e) => setGroupBanner(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2"
              placeholder="Image URL"
            />
          </label>
        </div>
        <label className="text-sm text-white/70">
          Beschreibung
          <textarea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2"
            rows={3}
            placeholder="Worum geht es in dieser Gruppe?"
          />
        </label>
        <div className="mt-3 flex justify-end">
          <button className="rounded-2xl bg-primary/80 px-4 py-2 text-sm font-semibold">Gruppe erstellen</button>
        </div>
      </DashboardCard>

      <DashboardCard title="Top Mitglieder" subtitle="ranking">
        <div className="space-y-3">
          {topMembers.map((member, index) => (
            <div key={member.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-sm font-semibold text-white/80">
                  #{index + 1}
                </span>
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-white">{member.name}</p>
                    <p className="text-xs text-white/60">{member.points} Punkte</p>
                  </div>
                </div>
              </div>
              <span className="text-sm text-primary-light">Top 3</span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
