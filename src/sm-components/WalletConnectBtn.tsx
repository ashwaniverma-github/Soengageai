"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletConnectBtn() {
  const { connected } = useWallet();

  return (
    <div>
      <WalletMultiButton
        style={{
          backgroundColor: "purple",
          color: "white",
          borderRadius: "15px",
          padding: "15px",
          fontSize: "18px",
          fontWeight: "semibold",
          
        }}
        
      >
        {!connected ? "Signup" : "Connected"}
      </WalletMultiButton>
    </div>
  );
}