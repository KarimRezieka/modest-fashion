import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  amount: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 422 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { email: true, name: true },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parsed.data.amount,
      currency: "egp",
      metadata: { userId: user.userId },
      receipt_email: dbUser?.email,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
