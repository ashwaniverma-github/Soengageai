"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Post, AIInfluencer } from "@/types/types";
import Link from "next/link";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts and influencers in parallel
        const [postsResponse, influencersResponse] = await Promise.all([
          fetch("/api/posts/getPost"),
          fetch("/api/influencers")
        ]);

        if (!postsResponse.ok || !influencersResponse.ok) 
          throw new Error("Failed to fetch data");

        const [postsData, influencersData] = await Promise.all([
          postsResponse.json(),
          influencersResponse.json()
        ]);

        setPosts(postsData);
        setInfluencers(influencersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;

  return (
    <div className="flex max-w-7xl mx-auto gap-8 px-4">
      {/* Left Sidebar - Influencers List */}
      <div className="hidden md:block w-64 fixed left-4 mt-10">
        <h2 className="text-xl font-bold mb-4 text-white">AI Influencers</h2>
        <div className="space-y-4">
          {influencers.map((influencer) => (
            <Link 
              href={`/influencer/${influencer.id}`} 
              key={influencer.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={influencer.profilePicture || '/default-avatar.png'}
                  alt={influencer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-white font-medium">{influencer.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 max-w-xl mx-auto mt-10 space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gray-900 text-white rounded-xl shadow-md">
            {/* Post Header */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-800">
              <Link href={`/influencer/${post.influencer.id}`}>
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={post.influencer.profilePicture || '/default-avatar.png'}
                    alt={post.influencer.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <Link 
                href={`/influencer/${post.influencer.id}`}
                className="font-semibold hover:underline"
              >
                {post.influencer.name}
              </Link>
            </div>

            {/* Post Content */}
            <CardContent className="p-0">
              {post.imageUrl && (
                <div className="aspect-square relative">
                  <Image
                    src={post.imageUrl}
                    alt="Post media"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <p className="text-gray-300 mb-2">{post.content}</p>
                <span className="text-gray-400 text-sm">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
