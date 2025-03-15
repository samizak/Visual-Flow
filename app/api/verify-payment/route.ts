import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../utils/superbase/client";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const userId = session.client_reference_id;
    const planType = session.metadata?.planType;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Update user's subscription status in Supabase
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        is_subscribed: true,
        subscription_type: planType,
        subscription_id: session.subscription as string,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user subscription:", error);
      return NextResponse.json(
        { error: "Failed to update subscription status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Error verifying payment" },
      { status: 500 }
    );
  }
}
