import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/superbase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    console.log("Verifying payment for session:", sessionId);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (!session || session.payment_status !== "paid") {
      console.error("Payment not completed:", session?.payment_status);
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get user ID from the client_reference_id
    const userId = session.client_reference_id;

    if (!userId) {
      console.error("No user ID found in session");
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    // Determine plan type from the subscription
    const planType = session.subscription
      ? (session.subscription as Stripe.Subscription).items.data[0].plan
          .interval
      : "monthly";

    console.log("Payment verified for user:", userId, "Plan:", planType);

    // Update user's subscription status in Supabase
    // Make sure to await the createClient call
    const supabase = await createClient();

    // Log the update we're about to make
    console.log("Updating subscription status for user:", userId, {
      is_subscribed: true,
      subscription_type: planType,
      subscription_id: session.subscription
        ? (session.subscription as Stripe.Subscription).id
        : null,
    });

    const { data, error } = await supabase
      .from("profiles")
      .update({
        is_subscribed: true,
        subscription_type: planType,
        subscription_id: session.subscription
          ? (session.subscription as Stripe.Subscription).id
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error updating user subscription:", error);
      return NextResponse.json(
        { error: "Failed to update subscription status" },
        { status: 500 }
      );
    }

    console.log("Successfully updated subscription status:", data);

    return NextResponse.json({
      success: true,
      message: "Payment verified and subscription updated",
      data: {
        userId,
        planType,
        subscriptionId: session.subscription
          ? (session.subscription as Stripe.Subscription).id
          : null,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
