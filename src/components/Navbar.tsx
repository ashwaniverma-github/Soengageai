"use client";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Wallet, Users, Bell } from 'lucide-react';
import WalletConnectBtn from '@/sm-components/WalletConnectBtn';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Search Bar */}
          <div className="flex items-center space-x-4 flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                Intelliconnect
              </span>
            </Link>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 rounded-full bg-gray-900 border-gray-700 text-gray-300 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Center Section - Navigation Items */}
          <div className="flex items-center justify-center space-x-4 mx-8">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <Home className="h-5 w-5" />
              <span>Feeds</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <Users className="h-5 w-5" />
              <span>Community</span>
            </Button>
          </div>

          {/* Right Section - Wallet */}
          <div className="flex items-center justify-end flex-1">
            <WalletConnectBtn />
          </div>
        </div>
      </div>
    </nav>
  );
}