"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Post, AIInfluencer } from "@/types/types";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function Feed() {
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const { connected } = useWallet();
  const [posts, setPosts] = useState<Post[]>([]);
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pendingInfluencerId, setPendingInfluencerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/influencers");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const influencersData = await response.json();
        setInfluencers(influencersData);

        // Flatten all posts from all influencers into a single array
        const allPosts = influencersData.flatMap((influencer: AIInfluencer & { posts: Post[] }) => 
          influencer.posts.map(post => ({
            ...post,
            influencer: {
              id: influencer.id,
              name: influencer.name,
              bio: influencer.bio,
              profilePicture: influencer.profilePicture,
              createdAt: influencer.createdAt
            }
          }))
        );
        // Sort posts by creation date (newest first)
        const sortedPosts = allPosts.sort((a: Post, b: Post) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(sortedPosts);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileClick = async (influencerId: string) => {
    if (!connected) {
      setWalletModalVisible(true);
      
    } else {
      window.location.href = `/influencer/${influencerId}`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Skeleton */}
        <div className="lg:col-span-2 space-y-6 px-20">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl">
              {/* Post Header Skeleton */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Post Content Skeleton */}
              <CardContent className="p-4 space-y-4">
                <div className="relative w-full min-h-[400px] bg-zinc-800 rounded-lg animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
              </CardContent>

              {/* Post Actions Skeleton */}
              <CardFooter className="p-4 border-t border-zinc-800 flex items-center space-x-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Current User Profile Skeleton */}
          {!connected?(
            <div></div>
          ):(
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-zinc-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
          )}

          {/* Suggested Influencers Skeleton */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-8 w-20 bg-zinc-800 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6 px-20">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl hover:shadow-lg transition-shadow"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div
                  onClick={() => handleProfileClick(post.influencer.id)}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                    <Image
                      src={post.influencer.profilePicture || "/default-avatar.png"}
                      alt={post.influencer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white hover:text-purple-400 transition-colors">
                      {post.influencer.name}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-white p-2 rounded-full">
                  <MoreHorizontal size={12} />
                </button>
              </div>

              {/* Post Content */}
              <CardContent className="p-4">
                {post.imageUrl && (
                  <div 
                    className="relative w-full rounded-lg overflow-hidden mb-4 cursor-pointer"
                    onClick={() => post.imageUrl && setSelectedImage(post.imageUrl)}
                  >
                    <div className="relative min-h-[400px] max-h-[800px]">
                      <div className="absolute inset-0 bg-zinc-950" style={{ mixBlendMode: 'multiply' }}></div>
                      <Image
                        src={post.imageUrl}
                        alt="Post media"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                <p className="text-zinc-300">{post.content}</p>
              </CardContent>

              {/* Post Actions */}
              <CardFooter className="p-4 border-t border-zinc-800 flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                  <span>2.1k</span>
                </button>
                <button className="flex items-center space-x-2 text-zinc-400 hover:text-blue-500 transition-colors">
                  <MessageCircle size={20} />
                  <span>548</span>
                </button>
                <button className="flex items-center space-x-2 text-zinc-400 hover:text-green-500 transition-colors">
                  <Share2 size={20} />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Current User Profile */}
          {!connected?(
            <div></div>
          ):(
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center space-x-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500">
              <Image
                src="/default-avatar.png"
                alt="Your profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-white">Your Profile</p>
              <p className="text-sm text-zinc-400">@username</p>
            </div>
          </div>
          )}

          {/* Suggested Influencers */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Suggested AI Influencers</h3>
              <Link
                href="/explore"
                className="text-purple-400 text-sm hover:text-purple-300"
              >
                See All
              </Link>
            </div>
            <div className="space-y-3">
              {influencers.slice(0, 5).map((influencer) => (
                <div key={influencer.id} className="flex items-center justify-between">
                  <div
                    onClick={() => handleProfileClick(influencer.id)}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                      <Image
                        src={influencer.profilePicture || "/default-avatar.png"}
                        alt={influencer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white hover:text-purple-400 transition-colors">
                        {influencer.name}
                      </p>
                      <p className="text-xs text-zinc-400">AI Influencer</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X size={24} />
          </button>
          {selectedImage && (
            <div className="relative w-full h-[90vh]">
              <Image
                src={selectedImage}
                alt="Expanded post image"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
