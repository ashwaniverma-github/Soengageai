"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostForm({ influencerId }: { influencerId: string }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("content", content);
      formData.append("influencerId", influencerId);

      const response = await fetch("/api/posts/createPost", {
        method: "POST",
        body: formData,
        headers: {
          "x-internal-secret": process.env.NEXT_PUBLIC_INTERNAL_SECRET || "",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      // Redirect or refresh posts
      router.refresh();
      alert("Post created successfully!");

      // Reset form
      setContent("");
      setFile(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          rows={4}
          required
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}