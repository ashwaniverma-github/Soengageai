// File: src/app/api/razorpay/captureOrder/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET!;
const RAZORPAY_API_BASE = process.env.RAZORPAY_API_BASE || "https://api.razorpay.com";

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from the URL
    const { payment_id, order_id, razorpay_signature } = Object.fromEntries(req.nextUrl.searchParams.entries());
    if (!payment_id || !order_id || !razorpay_signature) {
      throw new Error("Missing required query parameters");
    }

    // Verify the signature:
    // Expected signature is HMAC_SHA256(order_id + "|" + payment_id, RAZORPAY_SECRET)
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    // Optionally, fetch payment details from Razorpay API (if needed)
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET}`).toString("base64");

    const paymentRes = await fetch(`${RAZORPAY_API_BASE}/v1/payments/${payment_id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
    });
    const paymentData = await paymentRes.json();

    // Fetch order details to extract our notes (userId and credits)
    const orderRes = await fetch(`${RAZORPAY_API_BASE}/v1/orders/${order_id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
    });
    const orderData = await orderRes.json();

    const notes = orderData.notes;
    const userId = notes?.userId;
    const creditsStr = notes?.credits;
    if (!userId || !creditsStr) {
      throw new Error("Missing userId or credits in order notes");
    }
    const credits = parseInt(creditsStr, 10);

    // Payment amount (in paise) is available in paymentData.amount
    const amountPaise = parseInt(paymentData.amount, 10);
    const amount = amountPaise / 100;

    // Update your database with the transaction and increment user credits
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

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/pricing?payment=success&credits=${credits}`, process.env.NEXT_PUBLIC_BASE_URL)
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Capture error:", errorMessage);
    return NextResponse.redirect(
      new URL(`/pricing?payment=error&message=${encodeURIComponent(errorMessage)}`, process.env.NEXT_PUBLIC_BASE_URL)
    );
  }
}
