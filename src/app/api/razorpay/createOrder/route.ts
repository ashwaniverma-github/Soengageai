// File: src/app/api/razorpay/createOrder/route.ts
import { NextRequest, NextResponse } from "next/server";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET!;
const RAZORPAY_API_BASE = process.env.RAZORPAY_API_BASE || "https://api.razorpay.com";

export async function POST(req: NextRequest) {
  try {
    const { credits, price, userId } = await req.json(); // e.g., { "credits": 500, "price": 20, "userId": "user-uuid" }
    if (
      typeof credits !== "number" ||
      typeof price !== "number" ||
      typeof userId !== "string"
    ) {
      console.error("Invalid input types:", { credits, price, userId });
      return NextResponse.json({ error: "Invalid input types" }, { status: 400 });
    }
    if (!credits || !price || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert price to paise (e.g., 20 INR becomes 2000 paise)
    const exchangeRate = 80; // Replace with your conversion rate or a dynamic value
    const amountInINR = price * exchangeRate; // Now in INR
    const amountPaise = Math.round(amountInINR * 100);

    // Use a shorter receipt string that is under 40 characters.
    const receipt = `rcpt-${credits}-${Date.now()}`;

    const payload = {
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 1, // Auto-capture enabled
      notes: {
        userId,
        credits: credits.toString(),
      },
    };

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET}`).toString("base64");
    const orderRes = await fetch(`${RAZORPAY_API_BASE}/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    // Log the response for debugging
    const orderData = await orderRes.json();
    console.log("Razorpay Order API response:", orderData);

    // Check if order creation was successful
    if (!orderRes.ok || !orderData.id) {
      return NextResponse.json({ error: orderData.error || "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json(orderData, { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error instanceof Error ? error.message : error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

