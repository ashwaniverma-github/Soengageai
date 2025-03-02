"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ImageIcon, Heart, MessageCircle } from "lucide-react";
import ChatWindow from "@/components/ChatWindow";
import { AIInfluencer , Post } from "@/types/types";
import { Dialog , DialogContent } from "@/components/ui/dialog";
export default function InfluencerPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use to unwrap the params Promise
  const { id: influencerId } = React.use(params);
  
  const [influencer, setInfluencer] = useState<AIInfluencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);


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
      <div className="container w-full mx-auto px-4 py-8  bg-zinc-950">
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-gray-800/50 rounded-xl"></div>
          <div className="flex gap-6">
            <div className="w-28 h-28 rounded-full bg-gray-800/80"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-800/80 rounded w-1/3"></div>
              <div className="h-4 bg-gray-800/50 rounded w-full"></div>
              <div className="h-4 bg-gray-800/50 rounded w-2/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/30 rounded-xl h-64"></div>
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
              <Button
                onClick={() => setChatOpen(true)}
                className="rounded-full text-white font-semibold bg-purple-600 hover:bg-purple-700"
              >
                Chat
              </Button>
            </div>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="mt-8 pb-16">
          <h2 className="text-xl font-bold text-white mb-4">Posts</h2>
          
          {influencer.posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {influencer.posts.map((post) => (
              <Card onClick={()=>{setSelectedPost(post)}} key={post.id} className=" cursor-pointer bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-purple-900/10 overflow-hidden">
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

        {/* Expanded Post Modal */}
            {selectedPost && selectedPost.imageUrl && (
      <Dialog open onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
          <button
            onClick={() => setSelectedPost(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
          <div className="relative w-full h-[90vh]">
            <Image
              src={selectedPost.imageUrl}
              alt="Expanded post image"
              fill
              className="object-contain"
              quality={100}
            />
          </div>
        </DialogContent>
      </Dialog>
    )}

        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center rounded-lg justify-center bg-black bg-opacity-75">
          <ChatWindow influencerId={influencer.name.toLowerCase()} onClose={() => setChatOpen(false)} />
        </div>
      )}
    </div>
  );
}