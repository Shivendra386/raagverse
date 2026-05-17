import type { CheckoutProvider, CheckoutSession, Course } from "@/lib/types";

type CheckoutInput = {
  provider: CheckoutProvider;
  currency: "INR" | "USD";
  course: Course;
  origin: string;
  buyerEmail?: string;
};

function amountInSmallestUnit(amount: number) {
  return Math.round(amount * 100);
}

function appMode(): "live" | "test" {
  return process.env.NODE_ENV === "production" ? "live" : "test";
}

function simulatedCheckout(input: CheckoutInput): CheckoutSession {
  const prefix = input.provider === "razorpay" ? "rzp_order_demo" : "stripe_cs_demo";
  return {
    provider: input.provider,
    courseId: input.course.id,
    amount: input.course.price,
    currency: input.currency,
    mode: appMode(),
    checkoutId: `${prefix}_${crypto.randomUUID()}`,
    checkoutUrl: `${input.origin}/courses?checkout=demo&courseId=${encodeURIComponent(input.course.id)}`,
    simulated: true,
  };
}

async function createStripeCheckout(input: CheckoutInput): Promise<CheckoutSession> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return simulatedCheckout(input);

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", `${input.origin}/dashboard/student?checkout=success&courseId=${encodeURIComponent(input.course.id)}`);
  params.append("cancel_url", `${input.origin}/courses?checkout=cancelled&courseId=${encodeURIComponent(input.course.id)}`);
  params.append("client_reference_id", input.course.id);
  params.append("metadata[courseId]", input.course.id);
  params.append("line_items[0][quantity]", "1");
  params.append("line_items[0][price_data][currency]", input.currency.toLowerCase());
  params.append("line_items[0][price_data][unit_amount]", String(amountInSmallestUnit(input.course.price)));
  params.append("line_items[0][price_data][product_data][name]", input.course.title);
  params.append("line_items[0][price_data][product_data][description]", input.course.description);
  if (input.buyerEmail) params.append("customer_email", input.buyerEmail);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secretKey}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error(`Stripe Checkout failed: ${await response.text()}`);
  }

  const session = (await response.json()) as { id: string; url?: string };
  return {
    provider: "stripe",
    courseId: input.course.id,
    amount: input.course.price,
    currency: input.currency,
    mode: appMode(),
    checkoutId: session.id,
    checkoutUrl: session.url,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    simulated: false,
  };
}

async function createRazorpayCheckout(input: CheckoutInput): Promise<CheckoutSession> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return simulatedCheckout(input);

  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      authorization: `Basic ${credentials}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInSmallestUnit(input.course.price),
      currency: input.currency,
      receipt: `course_${input.course.id}`.slice(0, 40),
      notes: {
        courseId: input.course.id,
        courseTitle: input.course.title,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Razorpay order creation failed: ${await response.text()}`);
  }

  const order = (await response.json()) as { id: string; amount: number; currency: string };
  return {
    provider: "razorpay",
    courseId: input.course.id,
    amount: order.amount / 100,
    currency: order.currency === "USD" ? "USD" : "INR",
    mode: appMode(),
    checkoutId: order.id,
    orderId: order.id,
    publishableKey: keyId,
    simulated: false,
  };
}

export async function createCheckoutSession(input: CheckoutInput) {
  if (input.provider === "stripe") return createStripeCheckout(input);
  return createRazorpayCheckout(input);
}
