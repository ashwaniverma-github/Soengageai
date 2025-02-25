import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl"

export async function POST(req: NextRequest) {
  try {
    const { wallet, signature, message } = await req.json();

    if (!wallet || !signature || !message) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Convert signature & message to Uint8Array
    const signatureBytes = Buffer.from(signature, "base64");
    const messageBytes = new TextEncoder().encode(message);

    // Verify the signature
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      new Uint8Array(new PublicKey(wallet).toBuffer())
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Authentication successful, return success response
    return NextResponse.json({ success: true, wallet });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
