export interface AIInfluencer {
  id: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  influencer: AIInfluencer;
  influencerId: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  user: User;
  postId: string;
  createdAt: string;
}

export interface User {
  id: string;
  wallet: string;
  username?: string;
  createdAt: string;
}