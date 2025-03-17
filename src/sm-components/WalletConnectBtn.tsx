"use client";
import { useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletConnectBtn() {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    async function saveWallet() {
      if (connected && publicKey) {
        try {
          const res = await fetch("/api/auth/wallet", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ wallet: publicKey.toString() }),
          });
          const data = await res.json();
          console.log("Wallet saved:", data);
        } catch (error) {
          console.error("Error saving wallet:", error);
        }
      }
    }
    saveWallet();
  }, [connected, publicKey]);

  return (
    <div>
      <WalletMultiButton
        style={{
          backgroundColor: "purple",
          color: "white",
          borderRadius: "15px",
          padding: "15px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {!connected ? "Signup" : "Connected"}
      </WalletMultiButton>
    </div>
  );
}
