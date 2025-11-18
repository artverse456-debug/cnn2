export type Challenge = {
  id: string;
  title: string;
  description: string;
  reward: string;
  entries: number;
  deadline: string;
  price: number;
  tags: string[];
};

export type Creator = {
  id: string;
  name: string;
  avatar: string;
  category: string;
  followers: number;
  price: number;
  bio: string;
  highlights: string[];
  challenges: Challenge[];
};

export type Reward = {
  id: string;
  title: string;
  points: number;
  description: string;
  stock: number;
};

export type FeedComment = {
  id: string;
  author: string;
  text: string;
};

export type FeedPost = {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: FeedComment[];
};

export type CreatorGroup = {
  id: string;
  title: string;
  description: string;
  price: number;
  creator: {
    id: string;
    name: string;
    avatar: string;
    category: string;
  };
  perks: string[];
  feed: FeedPost[];
};

export type CreatorGroupSpotlight = {
  id: string;
  title: string;
  creator: string;
  description: string;
  price: string;
  avatar: string;
};

export type FanActivity = {
  id: string;
  action: string;
  timestamp: string;
  delta: number;
};
