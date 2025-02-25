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
          borderRadius: "20px",
          padding: "10px",
        }}
      >
        {!connected ? "Signup" : "Connected"}
      </WalletMultiButton>
    </div>
  );
}
