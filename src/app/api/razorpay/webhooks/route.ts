import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

interface PaymentNotes {
  userId: string;
  credits: string;
}

interface PaymentEntity {
  id: string;
  order_id: string;
  amount: number;
  notes: PaymentNotes;
}

interface PaymentFailedEntity {
  id: string;
  error_code: string;
  error_description: string;
}

async function handlePaymentCaptured(payment: PaymentEntity) {
  const { id: paymentId, order_id, amount, notes } = payment;
  const userId = notes?.userId;
  const creditsStr = notes?.credits;

  if (!userId || !creditsStr) {
    throw new Error("Missing userId or credits in payment notes");
  }

  const credits = parseInt(creditsStr, 10);
  const amountInRupees = amount / 100;

  // Idempotency check
  const existingTransaction = await prisma.transaction.findUnique({
    where: { paymentId },
  });

  if (existingTransaction) {
    console.log(`Payment ${paymentId} already processed`);
    return;
  }

  // Database transaction
  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId,
        orderId: order_id,
        paymentId,
        amount: amountInRupees,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: credits } },
    }),
  ]);

  console.log(`Added ${credits} credits to user ${userId}`);
}

async function handlePaymentFailed(payment: PaymentFailedEntity) {
  console.error(`Payment failed: ${payment.id} - ${payment.error_code}: ${payment.error_description}`);
  // Add your failed payment handling logic here
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Process event
    const event = JSON.parse(rawBody);
    console.log("Received event:", event.event);

    try {
      switch (event.event) {
        case "payment.captured":
          await handlePaymentCaptured(event.payload.payment.entity);
          break;
        case "payment.failed":
          await handlePaymentFailed(event.payload.payment.entity);
          break;
        default:
          console.log(`Unhandled event: ${event.event}`);
      }
    } catch (processingError) {
      console.error("Error processing event:", processingError);
      throw processingError;
    }

    // Return Razorpay-compliant response
    return NextResponse.json({ status: "ok" }, { status: 200 });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}