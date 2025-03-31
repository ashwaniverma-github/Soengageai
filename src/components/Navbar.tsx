"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Bell, Users, Menu, X} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import SignupModal from "@/sm-components/SignupModal";
import WalletConnectBtn from "@/sm-components/WalletConnectBtn";
import { useWallet } from "@solana/wallet-adapter-react";
import NotificationIcon from "@/sm-components/NotificationIcon";

import ProfileModal from "@/sm-components/ProfileModal";

export default function Navbar({ bg }: { bg: string }) {
  const router = useRouter();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session } = useSession();
  const { connected } = useWallet();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${bg} backdrop-blur-md border-b border-transparent`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center flex-1 md:flex-none">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden mr-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex items-center space-x-1">
              <img
                src="/favicon.ico"
                alt="Logo"
                className="h-8 w-8 object-contain" // Adjusted size and alignment
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                Soengageai
              </span>
            </Link>
            {/* Search bar - visible only on lg screens and up */}
            <div className="relative ml-4 w-64 hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 rounded-full bg-gray-900 border-gray-700 text-gray-300 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Center Section - Navigation Items */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                className="flex items-center gap-1 lg:gap-2 text-gray-300 hover:text-white px-2 lg:px-4"
              >
                <Home className="h-5 w-5" />
                <span className="text-sm lg:text-base">Feeds</span>
              </Button>
              {/* Replace static Notifications button with our dynamic NotificationIcon */}
              <NotificationIcon />
              <Button
                variant="ghost"
                className="flex items-center gap-1 lg:gap-2 text-gray-300 hover:text-white px-2 lg:px-4"
              >
                <Users className="h-5 w-5" />
                <span className="text-sm lg:text-base">Community</span>
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end flex-1 md:flex-none">
            <div className="hidden md:flex text-white justify-center items-center mr-4 lg:mr-28">
              
              <button
                className="font-semibold text-sm lg:text-base"
                onClick={() => router.push("/pricing")}
              >
                Pricing
              </button>
            </div>
            
            {session ? (
              <ProfileModal/>
            ) : connected ? (
              <WalletConnectBtn />
            ) : (
              <button
                onClick={() => setIsSignupOpen(true)}
                className="text-sm lg:text-base"
                style={{
                  backgroundColor: "purple",
                  color: "white",
                  borderRadius: "15px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-800 border-b border-gray-700">
          <div className="px-4 py-2 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={() => {
                router.push("/");
                setIsMobileMenuOpen(false);
              }}
            >
              <Home className="h-5 w-5 mr-2" />
              Feeds
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="h-5 w-5 mr-2" />
              Community
            </Button>
              <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={() => {
                router.push("/pricing");
                setIsMobileMenuOpen(false);
              }}
            >
              Pricing
            </Button>
          
          </div>
        </div>
      )}

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </nav>
  );
}
