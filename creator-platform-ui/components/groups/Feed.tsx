"use client";

import { useState } from "react";
import { FeedPost } from "@/lib/types";
import { useGroupMembershipStore } from "@/store/useGroupMembershipStore";

export type FeedProps = {
  posts: FeedPost[];
};

export function Feed({ posts }: FeedProps) {
  const { likes, toggleLike, comments, addComment } = useGroupMembershipStore();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const handleComment = (postId: string) => {
    const draft = drafts[postId]?.trim();
    if (!draft) return;
    addComment(postId, draft);
    setDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const liked = likes[post.id] ?? false;
        const totalLikes = post.likes + (liked ? 1 : 0);
        const combinedComments = [...post.comments, ...(comments[post.id] ?? [])];

        return (
          <article key={post.id} className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">{post.role}</p>
                <p className="text-lg font-semibold text-white">{post.author}</p>
                <p className="text-sm text-white/60">{post.timestamp}</p>
              </div>
            </div>
            <p className="mt-4 text-base text-white/80">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Group post visual"
                className="mt-4 w-full rounded-2xl border border-white/5 object-cover"
              />
            )}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-white transition hover:border-white/40"
              >
                <span>{liked ? "Geliked" : "Like"}</span>
                <span className="text-white/60">{totalLikes}</span>
              </button>
              <span>{combinedComments.length} Kommentare</span>
            </div>
            {combinedComments.length > 0 && (
              <div className="mt-4 space-y-3">
                {combinedComments.map((comment) => (
                  <div key={comment.id} className="rounded-2xl border border-white/5 bg-black/30 p-3">
                    <p className="text-sm font-semibold text-white">{comment.author}</p>
                    <p className="text-sm text-white/70">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 flex gap-3">
              <input
                value={drafts[post.id] ?? ""}
                onChange={(event) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [post.id]: event.target.value
                  }))
                }
                placeholder="Kommentar droppen"
                className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleComment(post.id)}
                className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Posten
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
