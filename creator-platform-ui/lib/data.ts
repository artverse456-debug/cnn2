import type { Challenge, Creator, CreatorGroup, CreatorGroupSpotlight, FanActivity, GroupCard, Reward } from "./types";

export const featuredChallenges: Challenge[] = [
  {
    id: "points-quests",
    title: "Punkte-Quests",
    description: "Erledige kleine Aufgaben wie Kommentieren, Liken oder Teilen und erhalte sofort Punkte.",
    reward: "Sofortpunkte pro Aktion",
    entries: 1840,
    deadline: "rolling",
    price: 0,
    badgeLabel: "Live",
    entriesLabel: "1840 Fans aktiv diese Woche",
    linkLabel: "Quests öffnen",
    tags: ["engagement", "punkte", "quests"]
  },
  {
    id: "new-rewards",
    title: "Neue Rewards verfügbar",
    description: "Creator haben neue Belohnungen freigeschaltet: digitale Packs, Shoutouts und limitierter Merch.",
    reward: "Reward-Drops in Premium & Public",
    entries: 326,
    deadline: "rolling",
    price: 0,
    badgeLabel: "Drops aktiv",
    entriesLabel: "326 Rewards wurden diese Woche eingelöst",
    linkLabel: "Rewards ansehen",
    tags: ["rewards", "drops", "fanclub"]
  },
  {
    id: "subscription-boosts",
    title: "Abo-Boosts",
    description: "Premium-Fans erhalten monatlich Punkte automatisch gutgeschrieben.",
    reward: "Automatische Punkte-Gutschrift",
    entries: 912,
    deadline: "rolling",
    price: 0,
    badgeLabel: "Auto-Boost",
    entriesLabel: "912 Boosts im letzten Monat",
    linkLabel: "Details öffnen",
    tags: ["abo", "punkte", "boost"]
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
    bio: "Entwickelt AR-Welten und nutzt CreatorPulse, um Briefings, Punkte und Rewards für die Community zu steuern.",
    highlights: ["CreatorPulse Top 10", "XR Mentorin", "Adobe MAX Speaker"],
    challenges: featuredChallenges
  },
  {
    id: "leo-stone",
    name: "Leo Stone",
    avatar: "https://i.pravatar.cc/160?img=12",
    category: "Cinematic Story",
    followers: 305000,
    price: 19,
    bio: "Filmemacher, der seine Challenges und Gruppen auf CreatorPulse für exklusive Cuts und Feedback Sessions nutzt.",
    highlights: ["SXSW Audience Award", "CreatorPulse Film Lab", "Mentorings mit Community"],
    challenges: [featuredChallenges[2]]
  },
  {
    id: "ava-kai",
    name: "Ava Kai",
    avatar: "https://i.pravatar.cc/160?img=32",
    category: "Audio Reactor",
    followers: 510000,
    price: 32,
    bio: "Produziert elektronische Sets und hostet wöchentliche Remix-Challenges mit Rewards auf CreatorPulse.",
    highlights: ["Tomorrowland Newcomer", "LoopLab Gründerin", "CreatorPulse Live Battles"],
    challenges: [featuredChallenges[1]]
  }
];

export const popularGroups: GroupCard[] = [
  {
    id: "neon-render-lab",
    title: "Neon Render Lab",
    creator: "Mila Ray",
    avatar: "https://i.pravatar.cc/160?img=47",
    description: "Wöchentliche AR-Render-Drops, Fanpunkte für Feedback und Rewards mit Shader-Presets.",
    priceLabel: "ab 7 € / Monat",
    members: 2480,
    avgMonthlyPoints: 1680
  },
  {
    id: "analog-cine-guild",
    title: "Analog Cine Guild",
    creator: "Leo Stone",
    avatar: "https://i.pravatar.cc/160?img=12",
    description: "Storyboards, Shotlists und Fan-Votings mit Punkte-Belohnungen für Rough-Cut Feedback.",
    priceLabel: "ab 5 € / Monat",
    members: 1730,
    avgMonthlyPoints: 1240
  },
  {
    id: "loop-society",
    title: "Loop Society",
    creator: "Ava Kai",
    avatar: "https://i.pravatar.cc/160?img=32",
    description: "Remix-Battles mit automatischen Punkte-Boosts, exklusive Stems und monatliche Reward-Drops.",
    priceLabel: "ab 3 € / Monat",
    members: 3180,
    avgMonthlyPoints: 1910
  }
];

export const creatorGroups: CreatorGroup[] = [
  {
    id: "group-neon-lab",
    title: "Neon Render Lab",
    description: "Private Work-in-Progress Room für Mila Rays volumetrische Szenen, inklusive Layer-Files und wöchentlichen Live-Q&As.",
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
    perks: ["Scene Breakdowns", "Feedback Threads", "Shader-Stacks zum Download"],
    rules: ["Keine finalen Client-Files teilen", "Feedback in Threads halten", "Credits für Presets geben"],
    rewards: ["Shader Preset Bundle", "1:1 Crit Session", "Early Access Scene Files"],
    feed: [
      {
        id: "post-neon-01",
        author: "Mila Ray",
        role: "Creator",
        timestamp: "vor 2 Std.",
        content: "Neues Challenge-Briefing im CreatorPulse Dashboard veröffentlicht – hier das Blockout für den nächsten Lens.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        likes: 218,
        comments: [
          { id: "comment-neon-01", author: "Nova", text: "Reward Drop wann?" },
          { id: "comment-neon-02", author: "Ren", text: "Das Lighting ist wild." }
        ]
      },
      {
        id: "post-neon-02",
        author: "Lumi",
        role: "Fan",
        timestamp: "vor 1 Tag",
        content: "Habe das Fog-Setup aus der Challenge nachgebaut – Feedback erwünscht, Punkte sind schon getrackt.",
        likes: 132,
        comments: [{ id: "comment-neon-03", author: "Mila Ray", text: "Die Depth Map sitzt!" }]
      }
    ]
  },
  {
    id: "group-cine-guild",
    title: "Analog Cine Guild",
    description: "Leo Stone öffnet seine Shotlists, Kontaktabzüge und Rough Cuts für Mitglieder seiner CreatorPulse Gruppe.",
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
        content: "Neuer Grain-Test aus der aktuellen Challenge. Der Voting-Link läuft bis morgen im CreatorPulse Dashboard.",
        image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        likes: 188,
        comments: [{ id: "comment-cine-01", author: "Eli", text: "Shadow roll-off ist butterweich." }]
      },
      {
        id: "post-cine-02",
        author: "Kai",
        role: "Fan",
        timestamp: "vor 3 Tagen",
        content: "Storyboard-Template aus dem Reward eingelöst und die Doku geplant – Feedback erwünscht!",
        likes: 96,
        comments: []
      }
    ]
  },
  {
    id: "group-loop-society",
    title: "Loop Society",
    description: "Ava Kais Members-only Soundpack Drops + Remix Battles mit exklusiven Stems und Punkten.",
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
    perks: ["Stems aus Live-Sets", "Listening Parties", "Monatliche Remix Battles"],
    rules: ["Samples nur für Members nutzen", "Battles wöchentlich voten", "Kritik konstruktiv halten"],
    rewards: ["Exclusive Stems Pack", "VIP Listening Session", "Remix Battle Spotlight"],
    feed: [
      {
        id: "post-loop-01",
        author: "Ava Kai",
        role: "Creator",
        timestamp: "vor 8 Std.",
        content: "Neuer Percussion Stack (126 BPM) als Reward Drop live – Fans sammeln Punkte über die Remix Challenge.",
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
        content: "Remix-WIP für Runde 02 – Voting läuft im CreatorPulse Feed, Punkte sind schon verbucht.",
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
    description: "Work-in-Progress Room mit exklusiven Szenen, Layer-Files und Reward Drops.",
    price: "€6/Monat",
    avatar: "https://i.pravatar.cc/160?img=47"
  },
  {
    id: "cine-guild",
    creator: "Leo Stone",
    title: "Analog Cine Guild",
    description: "Shotlists, Rough Cuts und Feedback-Runden für Challenge-Teilnehmer:innen.",
    price: "€6/Monat",
    avatar: "https://i.pravatar.cc/160?img=12"
  }
];

export const rewards: Reward[] = [
  {
    id: "reward-mentor",
    title: "1:1 Mentor Session",
    points: 420,
    description: "Persönliche Roadmap-Session direkt über CreatorPulse buchen.",
    stock: 8
  },
  {
    id: "reward-backstage",
    title: "Backstage Badge",
    points: 260,
    description: "Zugang zu privaten Kanälen und Shoutout im Livestream sichern.",
    stock: 32
  },
  {
    id: "reward-drop",
    title: "Merch Capsule",
    points: 180,
    description: "Limitierter Merch Drop, direkt nach Punkteeinlösung verschickt.",
    stock: 120
  }
];

export const fanActivity: FanActivity[] = [
  {
    id: "activity-1",
    action: "Challenge \"Live Remix\" abgeschlossen",
    timestamp: "vor 2 Std.",
    delta: 120
  },
  {
    id: "activity-2",
    action: "Backstage Badge eingelöst",
    timestamp: "Gestern",
    delta: -260
  },
  {
    id: "activity-3",
    action: "Daily Streak Bonus",
    timestamp: "vor 2 Tagen",
    delta: 40
  }
];

export const paymentMethods = [
  { id: "paypal", label: "PayPal", description: "PayPal verbinden und Rewards sofort auszahlen." },
  { id: "card", label: "Kreditkarte", description: "Visa, Mastercard, Amex für Challenge-Tickets." }
];
