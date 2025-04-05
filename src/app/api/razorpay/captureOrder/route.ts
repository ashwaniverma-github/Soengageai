import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET!;
const RAZORPAY_API_BASE = process.env.RAZORPAY_API_BASE || "https://api.razorpay.com/v1";

export async function GET(req: NextRequest) {
  try {
    // Validate parameters
    const { payment_id, order_id, razorpay_signature } = Object.fromEntries(
      req.nextUrl.searchParams.entries()
    );

    if (!payment_id || !order_id || !razorpay_signature) {
      throw new Error("Missing required parameters");
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    // Idempotency check
    const existingTransaction = await prisma.transaction.findUnique({
      where: { paymentId: payment_id },
    });

    if (existingTransaction) {
      console.log(`Payment ${payment_id} already processed`);
      return NextResponse.redirect(
        new URL(`/pricing?payment=success`, process.env.NEXT_PUBLIC_BASE_URL!)
      );
    }

    // Fetch payment details
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET}`).toString("base64");
    const paymentRes = await fetch(`${RAZORPAY_API_BASE}/payments/${payment_id}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    
    if (!paymentRes.ok) throw new Error("Failed to fetch payment details");
    const paymentData = await paymentRes.json();

    // Process payment
    const amount = parseInt(paymentData.amount, 10) / 100;
    const notes = paymentData.notes || {};
    const userId = notes.userId;
    const credits = parseInt(notes.credits, 10);

    if (!userId || isNaN(credits)) {
      throw new Error("Invalid user ID or credits");
    }

    // Update database
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          orderId: order_id,
          paymentId: payment_id,
          amount,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits } },
      }),
    ]);

    return NextResponse.redirect(
      new URL(`/pricing?payment=success&credits=${credits}`, process.env.NEXT_PUBLIC_BASE_URL!)
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Capture error:", errorMessage);
    return NextResponse.redirect(
      new URL(`/pricing?payment=error&message=${encodeURIComponent(errorMessage)}`, 
      process.env.NEXT_PUBLIC_BASE_URL!)
    );
  }
}