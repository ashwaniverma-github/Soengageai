"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Credits() {
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/user/credits");
        const data = await res.json();
        if (res.ok) {
          setCredits(data.credits);
        } else {
          setError(data.error || "Failed to fetch credits");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch credits");
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  return (
    <div 
      onClick={() => router.push("/pricing")} 
      className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer"
    >
      {loading ? (
        <div className="flex items-center text-white">
          
          <Loader className="animate-spin "/>
        </div>
      ) : error ? (
        <span className="text-red-200 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </span>
      ) : (
        <div className="flex items-center text-white font-medium">
          
          {credits} Credits
        </div>
      )}
    </div>
  );
}