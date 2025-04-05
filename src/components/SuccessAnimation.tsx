"use client";

import { useRouter } from "next/navigation";
import { Check, ChevronRight, Star } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SuccessAnimationProps {
  credits: number;
  onClose: () => void;
}

export default function SuccessAnimation({ credits, onClose }: SuccessAnimationProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Sequence the animations
    const timer1 = setTimeout(() => setShowCheckmark(true), 300);
    const timer2 = setTimeout(() => setShowConfetti(true), 600);
    const timer3 = setTimeout(() => setShowContent(true), 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div 
        className={`bg-white rounded-xl shadow-2xl p-8 text-center max-w-sm w-full relative overflow-hidden transform transition-all duration-500 ${
          showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {/* Background success gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white z-0"></div>

        {/* Success checkmark animation */}
        <div className="relative z-10 mb-6">
          <div className={`mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center transform transition-all duration-700 ${
            showCheckmark ? "scale-100" : "scale-0"
          }`}>
            <Check className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Confetti animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animation-delay-random"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'][
                    Math.floor(Math.random() * 5)
                  ],
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                }}
              />
            ))}
          </div>
        )}

        {/* Main content */}
        <div className={`relative z-10 transition-all duration-700 delay-300 ${
          showContent ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
        }`}>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Success!</h2>
          <div className="flex items-center justify-center space-x-1 mb-6">
            <span className="text-gray-700 font-semibold text-lg">{credits}</span>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-gray-700 font-semibold text-lg ml-1">credits</span>
            </div>
            <span className="text-gray-600 text-lg">added to your account</span>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                onClose();
                router.push("/dashboard");
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/20 transform transition-all duration-200 hover:translate-y-px flex items-center justify-center"
            >
              <span>Go to Dashboard</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            
          </div>
        </div>
      </div>

      {/* Global animation styles */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(800px) rotate(360deg);
            opacity: 0;
          }
        }
        .animation-delay-random {
          animation-delay: calc(Math.random() * 2s);
        }
      `}</style>
    </div>
  );
}