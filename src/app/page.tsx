"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomePage from "@/components/Homepage";
import Feed from "@/components/Feed";

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // Only redirect to dashboard if we're on the homepage
    if (connected && window.location.pathname === '/') {
      router.push('/dashboard');
    }
  }, [connected, router]);

  return (
    <div className="min-h-screen">
      <HomePage/>
      <div className="bg-zinc-950 pt-5">
        <Feed/>
      </div>
    </div>
  );
}