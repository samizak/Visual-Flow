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

    const userId = session.client_reference_id;

    if (!userId) {
      console.error("No user ID found in session");
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const planType = session.subscription
      ? (session.subscription as Stripe.Subscription).items.data[0].plan
          .interval
      : "monthly";

    const supabase = await createClient();

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
