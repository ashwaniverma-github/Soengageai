// lib/solana.ts
import { PublicKey } from "@solana/web3.js";
import { verify } from "@noble/ed25519";

export const verifyMessage = async (
  publicKey: string,
  message: string,
  signature: number[]
): Promise<boolean> => {
  try {
    // Convert signature to Uint8Array
    const signatureUint8 = Uint8Array.from(signature);
    
    // Convert message to Uint8Array
    const messageUint8 = new TextEncoder().encode(message);
    
    // Get public key bytes
    const pubKey = new PublicKey(publicKey);
    const publicKeyBytes = pubKey.toBytes();

    // Verify the signature using noble/ed25519
    return await verify(signatureUint8, messageUint8, publicKeyBytes);
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
};