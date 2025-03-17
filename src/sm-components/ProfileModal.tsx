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

  const toggleDropdown = () => setIsOpen((prev) => !prev);

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
      {/* Avatar Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="relative focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full shadow-md"
          />
        ) : connected && publicKey ? (
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white shadow-md">
            {avatarText}
          </div>
        ) : (
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-md">
            {avatarText}
          </div>
        )}
      </button>

      {/* Dropdown (render only when isOpen is true) */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50"
        >
          <div className="p-4">
            {session ? (
              <div className="flex flex-col items-center space-y-3">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-gray-700 hover:border-purple-400 transition-all duration-300"
                  />
                ) : connected && publicKey ? (
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl text-white border-2 border-gray-700 hover:border-purple-400 transition-all duration-300">
                    {avatarText}
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center text-2xl text-white border-2 border-gray-700 hover:border-purple-400 transition-all duration-300">
                    {avatarText}
                  </div>
                )}
                <p className="text-lg font-bold text-white truncate">
                  {session.user.name || session.user.email}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {session.user.email}
                </p>
                <div className="w-full mt-3">
                  <Credits />
                </div>
                <button
                  onClick={() => signOut()}
                  className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white rounded-lg transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : connected && publicKey ? (
              <div className="flex flex-col items-center space-y-3">
                <p className="text-lg font-bold text-white break-all">
                  {publicKey.toString().slice(0, 10)}...
                </p>
                <div className="w-full">
                  <WalletConnectBtn />
                </div>
              </div>
            ) : (
              <div className="text-center text-white">No user signed in.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
