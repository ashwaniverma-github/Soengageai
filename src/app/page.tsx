"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomePage from "@/components/Homepage";
import Feed from "@/components/Feed";
import SmHomepage from "@/components/Sm-Homepage";
import { useSession } from "next-auth/react";
export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();
  const {data:session} = useSession()

  useEffect(() => {
    // Only redirect to dashboard if we're on the homepage
    if ( (session || connected) && window.location.pathname === '/') {
      router.push('/dashboard');
    }
  }, [connected, router,session]);

  return (
    <div className="min-h-screen bg-black sm:bg-inherit">

      <div className="sm:hidden">
        <SmHomepage/>
      </div>

      <div className="hidden sm:block">
        <HomePage/>
      </div>

      <div className="bg-zinc-950 pt-5">
        <Feed/>
      </div>
    </div>
  );
}