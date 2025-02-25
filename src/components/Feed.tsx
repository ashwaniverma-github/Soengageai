"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Post } from "@/types/types";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts"); // Adjust this endpoint accordingly
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-gray-900 text-white p-4 rounded-xl shadow-md">
          <CardContent>
            <div className="flex items-center space-x-4 mb-3">
                
              <div className="font-semibold text-lg">{post.influencer.name}</div>
              <span className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-300 mb-3">{post.content}</p>
            {post.imageUrl && (
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt="Post media"
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
