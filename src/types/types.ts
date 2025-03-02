export interface AIInfluencer {
  id: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  posts: Post[]; // Added missing posts relation
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  influencer: AIInfluencer;
  influencerId: string;
  comments: Comment[];
  likes: Like[];
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  user: User;
  postId: string;
  post: Post; // Added missing post relation
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  user: User;
  postId: string;
  post: Post;
  createdAt: string;
}

export interface User {
  id: string;
  wallet: string;
  username?: string;
  profilePicture?: string;  // Add this
  createdAt: string;
  comments: Comment[];
  likes: Like[];
}