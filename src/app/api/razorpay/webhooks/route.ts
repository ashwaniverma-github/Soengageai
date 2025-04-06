import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const RAZORPAY_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing
  },
};

export async function POST(req: NextRequest) {
  try {
    console.log("Webhook handler invoked");

    // Use the built-in text() method to get the raw body
    const rawBody = await req.text();
    console.log("Raw body:", rawBody);

    // Extract the Razorpay signature from headers
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing Razorpay signature" }, { status: 400 });
    }

    // Compute the expected signature using the raw body
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse the webhook payload
    const event = JSON.parse(rawBody);
    console.log("Parsed event:", event);

    // Handle events
    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Function to handle payment captured event
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

async function handlePaymentCaptured(payment: PaymentEntity) {
  const { id: paymentId, order_id: orderId, amount, notes } = payment;

  const userId = notes?.userId;
  const creditsStr = notes?.credits;

  if (!userId || !creditsStr) {
    throw new Error("Missing userId or credits in payment notes");
  }

  const credits = parseInt(creditsStr, 10);
  const amountInRupees = amount / 100;

  // Check if the payment has already been processed
  const existingTransaction = await prisma.transaction.findUnique({
    where: { paymentId },
  });

  if (existingTransaction) {
    console.log(`Payment ${paymentId} already processed`);
    return; // Exit early to prevent duplicate processing
  }

  // Update the database
  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId,
        orderId,
        paymentId,
        amount: amountInRupees,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: credits } },
    }),
  ]);

  console.log(`Payment captured: ${paymentId}, credits added: ${credits}`);
}

// Function to handle payment failed event
interface PaymentFailedEntity {
  id: string;
  error_code: string;
  error_description: string;
}

async function handlePaymentFailed(payment: PaymentFailedEntity) {
  const { id: paymentId, error_code, error_description } = payment;

  console.error(`Payment failed: ${paymentId}, error: ${error_code} - ${error_description}`);
  // You can log this information or notify the user about the failure
}