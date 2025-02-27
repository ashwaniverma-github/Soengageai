"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Heart, MessageCircle, Calendar, User, ImageIcon } from "lucide-react";

interface Influencer {
  id: string;
  name: string;
  bio: string;
  profilePicture: string;
  createdAt: string;
  posts: Post[];
}

interface Post {
  id: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export default function InfluencerPage({ params }: { params: { id: string } }) {
  const influencerId = params.id;
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        console.log("Fetching influencer with ID:", influencerId);
        const response = await fetch(`/api/influencer/${influencerId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Influencer not found");
          }
          throw new Error("Failed to fetch influencer");
        }
        
        const data = await response.json();
        setInfluencer(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [influencerId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-8">
          {/* Cover Image Skeleton */}
          <div className="w-full h-40 md:h-64 bg-gray-800 rounded-xl"></div>
          
          {/* Profile Header Skeleton */}
          <div className="flex flex-col md:flex-row gap-6 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700 border-4 border-gray-900 mx-auto md:mx-0 md:-mt-16"></div>
            <div className="space-y-4 flex-1 text-center md:text-left">
              <div className="h-8 w-64 bg-gray-700 rounded mx-auto md:mx-0"></div>
              <div className="h-4 w-full md:w-3/4 bg-gray-700 rounded mx-auto md:mx-0"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded mx-auto md:mx-0"></div>
              <div className="h-10 w-40 bg-gray-700 rounded mx-auto md:mx-0"></div>
            </div>
          </div>
          
          {/* Stories/Highlights Skeleton */}
          <div className="flex overflow-x-auto gap-4 py-2 no-scrollbar">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-700"></div>
            ))}
          </div>
          
          {/* Posts Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-gray-800">
                <div className="aspect-square bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-red-500 text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-red-400 mb-2">{error}</h2>
          <p className="text-gray-400 mb-6">We couldn't find what you're looking for.</p>
          <Link href="/">
            <Button variant="outline" className="border-red-500/50 hover:bg-red-950/50">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-gray-500 text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-300 mb-2">Influencer Not Found</h2>
          <p className="text-gray-400 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
              Discover Creators
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Cover Photo Area */}
      <div className="w-full h-40 md:h-64 bg-gradient-to-r from-purple-900/30 to-blue-900/30 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 -mt-12 md:-mt-20 mb-8 relative z-10">
          <div className="relative mx-auto md:mx-0">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-950 shadow-xl bg-gray-800">
              {influencer.profilePicture ? (
                <Image
                  src={influencer.profilePicture}
                  alt={influencer.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 160px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-900/50">
                  <User size={40} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-2 border-gray-950"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-3 mt-2 md:mt-12">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                {influencer.name}
              </h1>
              <div className="flex items-center gap-2 justify-center md:justify-start text-xs">
                <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full">Creator</span>
                <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">Verified</span>
              </div>
            </div>
            
            <p className="text-gray-300 max-w-2xl">{influencer.bio}</p>
            
            <div className="flex items-center gap-4 text-gray-400 text-sm justify-center md:justify-start">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Joined {new Date(influencer.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <ImageIcon size={14} />
                <span>{influencer.posts.length} posts</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
              <Link href={`/influencer/${influencer.id}/create-post`}>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium">
                  Create Post
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                Message
              </Button>
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800 px-2 md:px-3">
                <Share2 size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-purple-400">12.5K</span>
              <span className="text-sm text-gray-400">Followers</span>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-blue-400">845</span>
              <span className="text-sm text-gray-400">Following</span>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-pink-400">62.3K</span>
              <span className="text-sm text-gray-400">Likes</span>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-green-400">89%</span>
              <span className="text-sm text-gray-400">Engagement</span>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Tabs */}
        <div className="flex border-b border-gray-800 mb-6 overflow-x-auto no-scrollbar">
          <button className="px-4 py-3 text-blue-400 border-b-2 border-blue-500 font-medium">
            Posts
          </button>
          <button className="px-4 py-3 text-gray-400 hover:text-gray-300">
            Videos
          </button>
          <button className="px-4 py-3 text-gray-400 hover:text-gray-300">
            Collections
          </button>
          <button className="px-4 py-3 text-gray-400 hover:text-gray-300">
            About
          </button>
        </div>

        {/* Posts Grid */}
        {influencer.posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {influencer.posts.map((post) => (
              <Card key={post.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-900/10 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square group">
                    <Image
                      src={post.imageUrl || "/api/placeholder/400/400"}
                      alt={post.content.substring(0, 30)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white line-clamp-1 text-sm">{post.content}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-gray-300 line-clamp-2 min-h-[2.5rem]">{post.content}</p>
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-red-400 flex items-center gap-1">
                          <Heart size={16} />
                          <span className="text-xs">124</span>
                        </button>
                        <button className="text-gray-500 hover:text-blue-400 flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span className="text-xs">18</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center mb-12">
            <div className="text-gray-500 text-4xl mb-4">📸</div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No Posts Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {influencer.name} hasn't shared any content yet. Check back later or be the first to create something!
            </p>
            <Link href={`/influencer/${influencer.id}/create-post`}>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                Create First Post
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}