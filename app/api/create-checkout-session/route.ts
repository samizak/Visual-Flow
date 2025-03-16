import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    // console.log(
    //   "Creating checkout session for user:",
    //   userId,
    //   "plan:",
    //   planType
    // );

    // Set up the price ID based on the plan type
    const priceId =
      planType === "yearly"
        ? process.env.YEARLY_PRICE_ID
        : process.env.MONTHLY_PRICE_ID;

    if (!priceId) {
      console.error("Missing price ID for plan type:", planType);
      return NextResponse.json(
        { error: "Invalid plan configuration" },
        { status: 500 }
      );
    }

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

    // console.log(session);

    // console.log("Checkout session created:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
