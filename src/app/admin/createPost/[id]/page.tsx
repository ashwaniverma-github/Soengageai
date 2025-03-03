"use client";

import { use } from "react";
import CreatePostForm from "@/components/admin/createPost";

type Props = {
  params: Promise<{ id: string }>;
  
};

export default function CreatePost({ params }: Props) {
  // Unwrap both promises
  const { id: influencerId } = use(params);
 

  return (
    <div>
      <h1>Create New Post</h1>
      <CreatePostForm influencerId={influencerId} />
    </div>
  );
}