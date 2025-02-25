export type Influencer = {
  id: string;
  name: string;
  bio: string;
  createdAt: string;
};

export type Post = {
  id: string;
  content: string;
  imageUrl: string;
  influencerId: string;
  createdAt: string;
  influencer: Influencer;
}; 