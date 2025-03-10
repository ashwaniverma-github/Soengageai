"use client";
import Navbar from "@/components/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connected } = useWallet();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // When session check is complete, redirect if neither authentication is present.
    if (status !== "loading") {
      if (!connected && !session) {
        router.push("/");
      }
    }
  }, [connected, session, status, router]);

  return (
    <>
      <Navbar bg="bg-black" />
      {children}
    </>
  );
}
