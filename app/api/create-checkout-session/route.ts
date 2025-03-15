import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../utils/superbase/client";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { userId, planType, email } = await request.json();

    // Validate the request
    if (!userId || !planType || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Set up the price ID based on the plan type
    const priceId =
      planType === "yearly"
        ? process.env.YEARLY_PRICE_ID // You'll need to add this to your .env
        : process.env.MONTHLY_PRICE_ID; // You'll need to add this to your .env

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/protected/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId,
        planType,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
