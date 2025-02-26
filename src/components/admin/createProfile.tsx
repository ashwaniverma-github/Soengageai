"use client";

import { useState } from "react";

export default function CreateInfluencerForm() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profilePicture) {
      setError("Profile picture is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("profilePicture", profilePicture);

      const res = await fetch("/api/profile/createProfile", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header, let the browser handle it
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create influencer");
      }

      alert("Influencer created successfully!");
      // Reset form
      setName("");
      setBio("");
      setProfilePicture(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create AI Influencer</h2>
      
      {error && <div className="mb-4 p-2 bg-red-600 text-white rounded">{error}</div>}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-800"
        required
      />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-800"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
        className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-800"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Influencer"}
      </button>
    </form>
  );
}