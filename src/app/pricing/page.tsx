"use client";

import Pricing from "@/components/Pricing";
import SignupModal from "@/sm-components/SignupModal";
import SuccessAnimation from "@/components/SuccessAnimation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Define types for Razorpay options and instance
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  notes: {
    userId: string;
    credits: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

// Extend the global Window interface with our Razorpay constructor
declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

interface CreditPackage {
  credits: number;
  price: number;
  features: string[];
  title: string;
  paymentType: string;
}

function SubscriptionPageContent() {
  const { connected } = useWallet();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successCredits, setSuccessCredits] = useState<number | null>(null);

  // Check query parameters for payment status on mount
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const creditsParam = searchParams.get("credits");
    const errorMessage = searchParams.get("message");

    if (paymentStatus === "success" && creditsParam) {
      const credits = parseInt(creditsParam, 10);
      setSuccessCredits(credits);
      setShowSuccess(true);
    } else if (paymentStatus === "error") {
      alert(`Error: ${errorMessage}`);
    }
  }, [searchParams]);

  const handleBuy = async (pkg: CreditPackage): Promise<void> => {
    // Use fallback empty strings so TS knows these values are strings
    const userId: string = session?.user.id ?? "";
    const userName: string = session?.user.name ?? "";
    const userEmail: string = session?.user.email ?? "";

    if (!userId && !connected) {
      setIsSignupOpen(true)
      return;
    }

    try {
      const response = await fetch("/api/razorpay/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credits: pkg.credits,
          price: pkg.price,
          userId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const { id: orderId, amount } = data;
      if (!orderId) {
        throw new Error("No order id returned from Razorpay");
      }

      // Generate a unique cancel token and store it in sessionStorage
      const cancelToken = Math.random().toString(36).substring(2);
      sessionStorage.setItem("cancelToken", cancelToken);

      // Prepare options for Razorpay Checkout
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: amount, // Amount in paise
        currency: "INR",
        name: "Soengageai",
        description: `Purchase ${pkg.credits} credits`,
        order_id: orderId,
        handler: function () {
          // On successful payment, redirect to capture endpoint
          window.location.href = `/pricing?payment=success&credits=${pkg.credits}`;
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        notes: {
          userId: userId,
          credits: pkg.credits.toString(),
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            // When payment is cancelled, pass the cancel token in query params
            const cancelToken = sessionStorage.getItem("cancelToken");
            console.log("Payment modal dismissed");
            window.location.href = `/pricing/cancel?token=${cancelToken}`;
          },
        },
      };

      // Initialize and open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Error purchasing credits:", message);
      alert(`Error purchasing credits: ${message}`);
    }
  };

  return (
    <>
      {showSuccess && successCredits !== null && (
        <SuccessAnimation
          credits={successCredits}
          onClose={() => {
            setShowSuccess(false);
            router.push("/dashboard"); // Redirect to dashboard on close
          }}
        />
      )}
      <div className="bg-black pt-16 px-4">
        <Pricing onBuy={handleBuy} />
        <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      </div>
    </>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriptionPageContent/>
    </Suspense>
  )
}
