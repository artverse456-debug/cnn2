import type { Challenge, Creator, FanActivity, Reward } from "./types";

export const featuredChallenges: Challenge[] = [
  {
    id: "challenge-sprint",
    title: "48h Design Sprint",
    description: "Pitch the boldest AR filter ideas for MiraFlux.",
    reward: "$5K + Collab",
    entries: 128,
    deadline: "2025-05-20",
    price: 49,
    tags: ["design", "ar", "rapid"]
  },
  {
    id: "challenge-rave",
    title: "Midnight Mix Drop",
    description: "Submit a 45s audio loop built from community samples.",
    reward: "VIP Festival Pass",
    entries: 312,
    deadline: "2025-05-29",
    price: 29,
    tags: ["music", "loop", "festival"]
  },
  {
    id: "challenge-story",
    title: "Documentary Short",
    description: "Tell a 2-min story about micro communities.",
    reward: "Mentorship + Gear",
    entries: 67,
    deadline: "2025-06-01",
    price: 79,
    tags: ["video", "story", "impact"]
  }
];

export const creators: Creator[] = [
  {
    id: "mila-ray",
    name: "Mila Ray",
    avatar: "https://i.pravatar.cc/160?img=47",
    category: "Immersive Design",
    followers: 420000,
    price: 24,
    bio: "Building surreal AR worlds blending architecture and street culture.",
    highlights: ["Led Adidas x Snapchat lens", "XR Mentor @ OnDeck", "Adobe MAX Speaker"],
    challenges: featuredChallenges
  },
  {
    id: "leo-stone",
    name: "Leo Stone",
    avatar: "https://i.pravatar.cc/160?img=12",
    category: "Cinematic Story",
    followers: 305000,
    price: 19,
    bio: "Filmmaker remixing documentaries with AI-enhanced footage.",
    highlights: ["Netflix Emerging Doc", "SXSW Audience Award"],
    challenges: [featuredChallenges[2]]
  },
  {
    id: "ava-kai",
    name: "Ava Kai",
    avatar: "https://i.pravatar.cc/160?img=32",
    category: "Audio Reactor",
    followers: 510000,
    price: 32,
    bio: "Produces melodic techno layers and leads live remix battles.",
    highlights: ["Tomorrowland newcomer", "Founder of LoopLab"],
    challenges: [featuredChallenges[1]]
  }
];

export const rewards: Reward[] = [
  {
    id: "reward-mentor",
    title: "1:1 Mentor Session",
    points: 420,
    description: "Schedule an intimate roadmap session with your creator.",
    stock: 8
  },
  {
    id: "reward-backstage",
    title: "Backstage Badge",
    points: 260,
    description: "Gain hidden channel access + livestream shoutout.",
    stock: 32
  },
  {
    id: "reward-drop",
    title: "Merch Capsule",
    points: 180,
    description: "Receive a limited drop shipped worldwide.",
    stock: 120
  }
];

export const fanActivity: FanActivity[] = [
  {
    id: "activity-1",
    action: "Completed \"Midnight Mix\"",
    timestamp: "2h ago",
    delta: 120
  },
  {
    id: "activity-2",
    action: "Redeemed Backstage Badge",
    timestamp: "Yesterday",
    delta: -260
  },
  {
    id: "activity-3",
    action: "Daily streak bonus",
    timestamp: "2d ago",
    delta: 40
  }
];

export const paymentMethods = [
  { id: "paypal", label: "PayPal", description: "Connect your PayPal for instant payouts." },
  { id: "card", label: "Kreditkarte", description: "Visa, Mastercard, Amex." }
];
