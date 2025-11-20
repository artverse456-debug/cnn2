import type { Challenge, Creator, CreatorGroup, CreatorGroupSpotlight, FanActivity, Reward } from "./types";

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

export const creatorGroups: CreatorGroup[] = [
  {
    id: "group-neon-lab",
    title: "Neon Render Lab",
    description: "Private Work-in-Progress room for Mila Rays volumetrische Szenen, inklusive Layer-Files und wöchentlichen Live-Q&As.",
    price: 8,
    members: 864,
    avgMonthlyPoints: 1420,
    recentPosts: 5,
    creator: {
      id: "mila-ray",
      name: "Mila Ray",
      avatar: "https://i.pravatar.cc/160?img=47",
      category: "Immersive Design"
    },
    perks: ["Scene Breakdown Drops", "Feedback Threads", "Stash of ready-to-use shaders"],
    rules: ["Keine finalen Client-Files teilen", "Feedback in Threads halten", "Credits für verwendete Presets geben"],
    rewards: ["Shader Preset Bundle", "1:1 Crit Session", "Early Access Scene Files"],
    feed: [
      {
        id: "post-neon-01",
        author: "Mila Ray",
        role: "Creator",
        timestamp: "vor 2 Std.",
        content: "Dropped das Blockout für den nächsten Adidas Lens. Habe das Glas jetzt mit Partikelspuren animiert.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        likes: 218,
        comments: [
          { id: "comment-neon-01", author: "Nova", text: "Brauche bitte die shader settings!" },
          { id: "comment-neon-02", author: "Ren", text: "Das Lighting ist wild." }
        ]
      },
      {
        id: "post-neon-02",
        author: "Lumi",
        role: "Fan",
        timestamp: "vor 1 Tag",
        content: "Habe Milas Fog-Setup auf Cinema portiert – hier mein Ergebnis für Feedback.",
        likes: 132,
        comments: [{ id: "comment-neon-03", author: "Mila Ray", text: "Die Depth Map sitzt!" }]
      }
    ]
  },
  {
    id: "group-cine-guild",
    title: "Analog Cine Guild",
    description: "Leo Stone öffnet seine Tagebücher: Shotlists, Kontaktabzüge und Rough Cuts – nur für Mitglieder.",
    price: 6,
    members: 512,
    avgMonthlyPoints: 980,
    recentPosts: 4,
    creator: {
      id: "leo-stone",
      name: "Leo Stone",
      avatar: "https://i.pravatar.cc/160?img=12",
      category: "Cinematic Story"
    },
    perks: ["Monatliche Filmstudien", "Location-Scouting-PDFs", "Kommentarspuren zu Rough Cuts"],
    rules: ["Footage vertraulich behandeln", "Respektvolle Kritik", "Keine Spoiler ohne Tag"],
    rewards: ["Analog Grain Pack", "Storyboard Template", "Private Rough Cut Screening"],
    feed: [
      {
        id: "post-cine-01",
        author: "Leo Stone",
        role: "Creator",
        timestamp: "vor 5 Std.",
        content: "Hier der neue Grain-Test mit dem 500T Push. Freue mich auf eure Notizen zur Farbkurve.",
        image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        likes: 188,
        comments: [{ id: "comment-cine-01", author: "Eli", text: "Shadow roll-off ist butterweich." }]
      },
      {
        id: "post-cine-02",
        author: "Kai",
        role: "Fan",
        timestamp: "vor 3 Tagen",
        content: "Hab das Storyboard Template benutzt und meine Doku geplant – Feedback erwünscht!",
        likes: 96,
        comments: []
      }
    ]
  },
  {
    id: "group-loop-society",
    title: "Loop Society",
    description: "Ava Kais Members-only Soundpack Drops + Remix Battles mit exklusiven Stems.",
    price: 5,
    members: 1043,
    avgMonthlyPoints: 1675,
    recentPosts: 6,
    creator: {
      id: "ava-kai",
      name: "Ava Kai",
      avatar: "https://i.pravatar.cc/160?img=32",
      category: "Audio Reactor"
    },
    perks: ["Stems aus Live-Sets", "Discord Listening Parties", "Monatliche Remix Battles"],
    rules: ["Samples nur für Members nutzen", "Battles wöchentlich voten", "Kritik konstruktiv halten"],
    rewards: ["Exclusive Stems Pack", "VIP Listening Session", "Remix Battle Spotlight"],
    feed: [
      {
        id: "post-loop-01",
        author: "Ava Kai",
        role: "Creator",
        timestamp: "vor 8 Std.",
        content: "Neuer Percussion Stack (126 BPM) – free für alle Members dieses Monats.",
        likes: 241,
        comments: [
          { id: "comment-loop-01", author: "Nox", text: "Hab den Stack direkt in Ableton gezogen." },
          { id: "comment-loop-02", author: "Rune", text: "Welche FX-Kette benutzt du?" }
        ]
      },
      {
        id: "post-loop-02",
        author: "Mira",
        role: "Fan",
        timestamp: "vor 4 Tagen",
        content: "Remix-WIP für Runde 02 – brauche Voting auf den Vocals.",
        likes: 154,
        comments: [{ id: "comment-loop-03", author: "Ava Kai", text: "Mehr Drive bei 2:14, sonst killer!" }]
      }
    ]
  }
];

export const topGroups: CreatorGroupSpotlight[] = [
  {
    id: "neon-render",
    creator: "Mila Ray",
    title: "Neon Render Lab",
    description: "Private Work-in-Progress room mit exklusiven Szenen & Layer-Files.",
    price: "€6/Monat",
    avatar: "https://i.pravatar.cc/160?img=47"
  },
  {
    id: "cine-guild",
    creator: "Leo Stone",
    title: "Analog Cine Guild",
    description: "Notizen, Shotlists & Rough Cuts — nur für Mitglieder.",
    price: "€6/Monat",
    avatar: "https://i.pravatar.cc/160?img=12"
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
