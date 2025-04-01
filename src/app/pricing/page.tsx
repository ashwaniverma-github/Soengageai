"use client";
import Pricing from "@/components/Pricing";
import SignupModal from "@/sm-components/SignupModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface CreditPackage {
  credits: number;
  price: number;
  features: string[];
  title: string;
  paymentType: string;
}

// Separate component for handling search params with Suspense
function PaymentStatusHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const credits = searchParams.get("credits");
    const errorMessage = searchParams.get("message");
    
    if (paymentStatus === "success") {
      alert(`Successfully purchased ${credits} credits!`);
    } else if (paymentStatus === "error") {
      alert(`Error: ${errorMessage}`);
    }
  }, [searchParams]);

  return null;
}

function SubscriptionPageContent() {
  const { connected } = useWallet();
  const { data: session } = useSession();
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleBuy = async (pkg: CreditPackage) => {
    if (!session?.user.id && !connected) {
      alert("You must be signed in or have connected your wallet to make a purchase.");
      return;
    }

    try {
      const response = await fetch("/api/paypal/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credits: pkg.credits,
          price: pkg.price,
          userId: session?.user.id
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const approvalLink = data.links?.find(
        (link: { rel: string; href: string }) => link.rel === "approve"
      )?.href;

      if (!approvalLink) {
        throw new Error("No approval link returned");
      }

      window.location.href = approvalLink;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Error purchasing credits:", message);
      alert(`Error purchasing credits: ${message}`);
    }
  };

  return (
    <div className="bg-black p-16">
      <Pricing onBuy={handleBuy} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <>
      <Suspense fallback={null}>
        <PaymentStatusHandler />
      </Suspense>
      <SubscriptionPageContent />
    </>
  );
}