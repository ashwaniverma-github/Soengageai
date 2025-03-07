"use client";
import Pricing from "@/components/Pricing";
import SignupModal from "@/sm-components/SignupModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SubscriptionPage() {
  const { connected } = useWallet();
  const { data: session } = useSession();
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleBuy = (pkg: { credits: number; price: number }) => {
    // If the user is not signed in via Google or wallet, open the signup modal.
    if (!session && !connected) {
      setIsSignupOpen(true);
      return;
    }
    // Otherwise, proceed with purchasing logic
    console.log("Purchasing package:", pkg);
    // Add your purchase integration here
  };

  return (
    <div className="bg-black p-16">
      <Pricing onBuy={handleBuy} />
      {/* Signup Modal: Shows if the user is not authenticated */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </div>
  );
}
