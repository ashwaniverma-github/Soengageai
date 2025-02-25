
import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export async function POST(req: NextRequest) {
  try {
    const { publicKey, signature, message } = await req.json();

    // Validate required fields
    if (!publicKey || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert base58 public key to bytes
    const publicKeyBytes = bs58.decode(publicKey);
    
    // Convert base64 encoded message and signature to Uint8Array
    const messageBytes = new Uint8Array(Buffer.from(message, 'base64'));
    const signatureBytes = new Uint8Array(Buffer.from(signature, 'base64'));

    // Verify the signature using ed25519
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    if (!isValid) {
      return NextResponse.json(
        { verified: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Additional security checks
    const decodedMessage = Buffer.from(messageBytes).toString('utf-8');
    const nonceMatch = decodedMessage.match(/Nonce: (\w+)/);
    
    if (!nonceMatch) {
      return NextResponse.json(
        { verified: false, error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Here you would typically check if the nonce has been used before
    // Example: await checkNonce(nonceMatch[1]);
    // Implement your anti-replay logic here

    return NextResponse.json({
      verified: true,
      publicKey,
      message: decodedMessage
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { verified: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}