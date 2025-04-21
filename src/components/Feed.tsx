"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Post, AIInfluencer } from "@/types/types";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignupModal from "@/sm-components/SignupModal";


export default function Feed() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const {data:session} = useSession();
  const { connected, publicKey } = useWallet();
  const [posts, setPosts] = useState<Post[]>([]);
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/influencers");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const influencersData = await response.json();
        setInfluencers(influencersData);

        // Flatten posts from all influencers
        const allPosts = influencersData.flatMap(
          (influencer: AIInfluencer & { posts: Post[] }) =>
            influencer.posts.map((post) => ({
              ...post,
              influencer: {
                id: influencer.id,
                name: influencer.name,
                bio: influencer.bio,
                profilePicture: influencer.profilePicture,
                createdAt: influencer.createdAt,
              },
            }))
        );

        // Sort posts by creation date (newest first)
        const sortedPosts = allPosts.sort(
          (a: Post, b: Post) =>
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

  const handleProfileClick = (influencerId: string) => {
    if (!connected && !session ) {
      setIsSignupOpen(true)
    } else {
      window.location.href = `/influencer/${influencerId}`;
    }
  };

  // Add handlers for expanding and collapsing posts
  const toggleExpandedPost = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Format text with bold markers
  const formatText = (text: string) => {
    if (!text.includes('**')) return text;
    
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={idx} className="font-bold">{boldText}</strong>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl">
              {/* Post Header Skeleton */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-32 animate-pulse" />
                    <div className="h-3 bg-zinc-800 rounded w-24 animate-pulse" />
                  </div>
                </div>
                <div className="w-6 h-6 bg-zinc-800 rounded-full animate-pulse" />
              </div>
  
              {/* Post Image Skeleton */}
              <div className="relative aspect-[4/3] bg-zinc-800 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent" />
              </div>
  
              {/* Post Content Skeleton */}
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-full animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
              </CardContent>
  
              {/* Post Footer Skeleton */}
              <CardFooter className="p-4 border-t border-zinc-800">
                <div className="flex items-center justify-between w-full">
                  <div className="h-8 bg-zinc-800 rounded-full w-24 animate-pulse" />
                  <div className="h-8 bg-zinc-800 rounded-full w-8 animate-pulse" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
  
        {/* Right Sidebar Skeleton */}
        <div className="space-y-6 lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-5rem)] lg:overflow-y-auto pt-6">
          {/* Profile Skeleton */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse" />
            </div>
          </div>
  
          {/* Suggested Influencers Skeleton */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 bg-zinc-800 rounded w-32 animate-pulse" />
              <div className="h-4 bg-zinc-800 rounded w-16 animate-pulse" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-800 rounded w-24 animate-pulse" />
                      <div className="h-3 bg-zinc-800 rounded w-16 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-8 bg-zinc-800 rounded-full w-20 animate-pulse" />
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
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl  mx-auto  grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div className="bg-zinc-900 p-4 sm:hidden rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Suggested AI Influencers</h3>
              
            </div>
            <div className="space-y-3">
              {influencers.slice(0, 5).map((influencer) => (
                <div key={influencer.id} className="flex items-center justify-between">
                  <Link href={`/influencer/${influencer.id}`} className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                      <Image
                        src={influencer.profilePicture || "/default-avatar.png"}
                        alt={influencer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-semibold text-white hover:text-purple-400 transition-colors">
                        {influencer.name}
                      </p>
                      <p className="text-xs text-zinc-400">AI Influencer</p>
                    </div>
                  </Link>
                  <Link href={`/influencer/${influencer.id}`}>
                    <button  className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">
                      View
                    </button>
                  </Link>
                  
                </div>
              ))}
            </div>
          </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6 pt-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-zinc-900 max-w-2xl border border-zinc-800 rounded-xl hover:shadow-lg transition-shadow"
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
              </div>

              {/* Post Content */}
              <CardContent className="p-4">
                {post.imageUrl && (
                  <div
                    className="relative w-full rounded-lg overflow-hidden mb-4 cursor-pointer"
                    onClick={() => setSelectedImage(post.imageUrl || '')}
                  >
                    {/* Responsive image container */}
                    <div className="relative 
                      h-[50vh]       // Mobile first height (50% of viewport)
                      md:h-[50vh]    // Medium screens
                      lg:h-[60vh]    // Large screens
                      xl:h-[70vh]    // Extra large screens
                      max-h-[700px]  // Absolute maximum height
                    ">
                      <div
                        className="absolute inset-0 bg-zinc-950"
                        style={{ mixBlendMode: "multiply" }}
                      ></div>
                      <Image
                        src={post.imageUrl}
                        alt="Post media"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {/* Check if post content is long enough to need "read more" */}
                  {(() => {
                    const words = post.content.split(/\s+/);
                    const isLongPost = words.length > 100;
                    
                    if (isLongPost && !expandedPosts[post.id]) {
                      // Get first 100 words for preview
                      const preview = words.slice(0, 100).join(' ');
                      const paragraphs = preview.split('\n');
                      
                      return (
                        <>
                          {paragraphs.map((paragraph, index) => (
                            <p key={index} className="text-zinc-300 leading-relaxed">
                              {formatText(paragraph)}
                              {index === paragraphs.length - 1 && '...'}
                            </p>
                          ))}
                          <button 
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
                            onClick={() => toggleExpandedPost(post.id)}
                          >
                            Read more
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </>
                      );
                    } else {
                      // Show full content or short post
                      return (
                        <>
                          {post.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="text-zinc-300 leading-relaxed">
                              {formatText(paragraph)}
                            </p>
                          ))}
                          {isLongPost && expandedPosts[post.id] && (
                            <button 
                              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
                              onClick={() => toggleExpandedPost(post.id)}
                            >
                              Show less
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      );
                    }
                  })()}
                  
                  {/* Hashtags section if the post has any */}
                  {post.content.includes('#') && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.content
                        .split(' ')
                        .filter(word => word.startsWith('#'))
                        .map((hashtag, index) => (
                          <span 
                            key={index} 
                            className="text-purple-400 hover:text-purple-300 cursor-pointer text-sm"
                          >
                            {hashtag}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Post Footer */}
              <CardFooter className="p-4 border-t border-zinc-800">
                
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-rem)] lg:overflow-y-auto pt-6">
          {/* Current User Profile */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center space-x-4">
            <div className="relative text-yellow-50 w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500">
              <Avatar className="flex justify-center items-center w-full h-full">
                <AvatarFallback className="font-bold flex justify-center items-center w-full h-full">
                  {publicKey
                    ? publicKey.toString().slice(0, 2).toUpperCase()
                    : session?.user?.name
                    ? session?.user.name.toString().slice(0,2).toUpperCase()
                    : "US"
                  }
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-semibold text-white">Your Profile</p>
              <p className="text-sm text-zinc-400">
                {publicKey
                  ? `@${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
                  : session?.user?.name
                  ? session.user.name
                  :"Not Signed in" 
                  }
              </p>
            </div>
          </div>

          {/* Suggested Influencers */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Suggested AI Influencers</h3>
              
            </div>
            <div className="space-y-3">
              {influencers.slice(0, 5).map((influencer) => (
                <div key={influencer.id} className="flex items-center justify-between">
                  <Link href={`/influencer/${influencer.id}`} className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                      <Image
                        src={influencer.profilePicture || "/default-avatar.png"}
                        alt={influencer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-semibold text-white hover:text-purple-400 transition-colors">
                        {influencer.name}
                      </p>
                      <p className="text-xs text-zinc-400">AI Influencer</p>
                    </div>
                  </Link>
                  <Link href={`/influencer/${influencer.id}`}>
                    <button className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors">
                      View
                    </button>
                  </Link>
                  
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
      <SignupModal isOpen={isSignupOpen}  onClose={()=>{setIsSignupOpen(false)}} />
    </>
  );
}