// app/dashboard/layout.tsx
"use client";
import Navbar from "@/components/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  return <>
  <Navbar bg="bg-black" />
  {children}
  </>;
}