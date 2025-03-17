// // contexts/WalletAuthContext.tsx
// "use client";
// import { createContext, useContext, useEffect, useState } from "react";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { verifyMessage } from "@/lib/solana";

// type WalletAuthContextType = {
//   walletUser: any;
//   loading: boolean;
//   signInWithWallet: () => Promise<void>;
// };

// const WalletAuthContext = createContext<WalletAuthContextType>({
//   walletUser: null,
//   loading: true,
//   signInWithWallet: async () => {},
// });

// export function WalletAuthProvider({ children }: { children: React.ReactNode }) {
//   const { connection } = useConnection();
//   const { publicKey, signMessage, connected } = useWallet();
//   const [walletUser, setWalletUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const signInWithWallet = async () => {
//     try {
//       setLoading(true);
//       if (!publicKey || !signMessage) throw new Error("Wallet not connected");

//       const message = `Sign in to AIConvo: ${Math.random().toString(36).substring(2, 15)}`;
//       const signature = await signMessage(new TextEncoder().encode(message));

//       const response = await fetch("/api/auth/wallet", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           publicKey: publicKey.toString(),
//           signature: Array.from(signature),
//           message,
//         }),
//       });

//       if (!response.ok) throw new Error("Authentication failed");
      
//       const user = await response.json();
//       setWalletUser(user);
//     } catch (error) {
//       console.error("Wallet auth error:", error);
//       setWalletUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const checkExistingSession = async () => {
//       try {
//         setLoading(true);
//         if (!publicKey) {
//           setWalletUser(null);
//           return;
//         }

//         const response = await fetch(`/api/auth/wallet?publicKey=${publicKey.toString()}`);
//         if (response.ok) {
//           const user = await response.json();
//           setWalletUser(user);
//         }
//       } catch (error) {
//         console.error("Session check error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (connected) checkExistingSession();
//   }, [connected, publicKey]);

//   return (
//     <WalletAuthContext.Provider value={{ walletUser, loading, signInWithWallet }}>
//       {children}
//     </WalletAuthContext.Provider>
//   );
// }

// export const useWalletAuth = () => useContext(WalletAuthContext);