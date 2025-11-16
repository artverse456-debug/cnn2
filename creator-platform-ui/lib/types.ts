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

export type FanActivity = {
  id: string;
  action: string;
  timestamp: string;
  delta: number;
};
