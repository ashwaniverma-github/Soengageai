"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import React from "react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const storedToken = sessionStorage.getItem("cancelToken");

    if (token && storedToken && token === storedToken) {
      setIsValid(true);
      sessionStorage.removeItem("cancelToken"); // Clear the token after validation
    } else {
      // Redirect to pricing page if the token is invalid
      router.push("/pricing");
    }
  }, [searchParams, router]);

  if (!isValid) {
    return null; // Render nothing while validating
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-700">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-6">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Cancelled</h1>
          <div className="h-1 w-16 bg-red-500/70 rounded-full mb-6"></div>
          <p className="text-gray-300 mb-8">
            It seems you have cancelled the payment process. No worries – you can try again whenever you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 flex-1 flex items-center justify-center gap-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => (window.location.href = "/pricing")}
              className="px-5 py-2.5 flex-1 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200 font-medium shadow-lg shadow-blue-900/20"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
