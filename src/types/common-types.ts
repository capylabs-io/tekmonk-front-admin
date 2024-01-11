export interface Event {
  title: string;
  day: string;
  month: string;
  weekday: string;
  timeRange: string;
}
export interface User {
  id: string;
  username: string;
  userRank: string;
  specialName: string;
  imageURL?: string;
  twitterName?: string;
}
export interface Certificate {
  name: string;
  type: string;
  progress: string;
  mission: string;
  imageUrl?: string;
}
export interface Project {
  name: string;
  author: User;
  thumbnailUrl: string;
  imageUrls: string[];
  createdAt: string;
  projectCategories: string[];
  description: string;
  likeCount: string;
  commentCount: string;
}

export interface LeaderboardData {
  user: User;
  score: string;
}
