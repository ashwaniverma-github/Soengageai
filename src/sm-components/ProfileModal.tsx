"use client";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import WalletConnectBtn from "@/sm-components/WalletConnectBtn";
import Credits from "@/sm-components/Credits";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { connected, publicKey } = useWallet();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Generate avatar text fallback
  const avatarText = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : publicKey
    ? publicKey.toString().slice(0, 2).toUpperCase()
    : "US";

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Avatar Button to open dropdown with pulse animation on hover */}
      <button 
        ref={buttonRef}
        onClick={toggleDropdown} 
        className={`relative focus:outline-none group ${isOpen ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="absolute inset-0 bg-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></div>
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={40}
            height={40}
            className={`rounded-full shadow-md transform transition-all duration-300 ${isOpen ? 'border-2 border-purple-500 scale-105' : 'border-2 border-transparent hover:border-purple-300 group-hover:scale-105'}`}
          />
        ) : connected && publicKey ? (
          <div className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white shadow-md transform transition-all duration-300 ${isOpen ? 'border-2 border-purple-500 scale-105' : 'border-2 border-transparent hover:border-purple-300 group-hover:scale-105'}`}>
            {avatarText}
          </div>
        ) : (
          <div className={`w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-md transform transition-all duration-300 ${isOpen ? 'border-2 border-purple-500 scale-105' : 'border-2 border-transparent hover:border-purple-300 group-hover:scale-105'}`}>
            {avatarText}
          </div>
        )}
      </button>

      {/* Dropdown Profile Menu with animation */}
      <div 
        ref={dropdownRef}
        className={`absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 origin-top-right transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
      >
        <div className="backdrop-blur-sm bg-gray-800/95 p-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-fadeIn">
              {session?.user?.image ? (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="relative rounded-full border-2 border-gray-700 hover:border-purple-400 transition-all duration-300"
                  />
                </div>
              ) : connected && publicKey ? (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xl text-white border-2 border-gray-700 hover:border-purple-400 transition-all duration-300">
                    {avatarText}
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center text-xl text-white border-2 border-gray-700 hover:border-purple-400 transition-all duration-300">
                    {avatarText}
                  </div>
                </div>
              )}
            </div>

            {/* Render based on authentication method with staggered animations */}
            {session ? (
              <div className="text-center w-full space-y-2 animate-slideUp">
                <p className="text-lg font-bold text-white truncate">
                  {session.user.name || session.user.email}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {session.user.email}
                </p>
                <div className="mt-3 bg-gray-700/60 backdrop-blur-sm rounded-lg p-3 transform transition-all duration-300 hover:bg-gray-700/80 hover:scale-102">
                  <Credits />
                </div>
                <button
                  onClick={() => signOut()}
                  className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-700/20 transform hover:-translate-y-0.5"
                >
                  Sign Out
                </button>
              </div>
            ) : connected && publicKey ? (
              <div className="text-center w-full space-y-2 animate-slideUp">
                <p className="text-lg font-bold text-white break-all">
                  {publicKey.toString().slice(0, 10)}...
                </p>
                <div className="mt-3 bg-gray-700/60 backdrop-blur-sm rounded-lg p-3 transform transition-all duration-300 hover:bg-gray-700/80 hover:scale-102">
                  <WalletConnectBtn />
                </div>
              </div>
            ) : (
              <div className="text-center w-full space-y-2 animate-slideUp">
                <p className="text-white mb-2">No user signed in</p>
                <WalletConnectBtn />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}