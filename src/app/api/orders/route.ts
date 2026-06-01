import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth-guard";
import { createOrderSchema } from "@/lib/validations/order";

const orderInclude = {
  items: true,
} as const;

function formatOrder(order: any) {
  return {
    ...order,
    subtotal: order.subtotal.toString(),
    shippingCost: order.shippingCost.toString(),
    total: order.total.toString(),
    items: order.items.map((i: any) => ({ ...i, price: i.price.toString() })),
  };
}

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: user.userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders: orders.map(formatOrder) });
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { paymentIntentId, shipping, items, subtotal, shippingCost } = parsed.data;

    // Verify the PaymentIntent was actually paid
    let pi;
    try {
      pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch {
      return NextResponse.json({ message: "Invalid payment intent" }, { status: 400 });
    }

    if (pi.status !== "succeeded") {
      return NextResponse.json({ message: "Payment not completed" }, { status: 400 });
    }

    if (pi.metadata.userId !== user.userId) {
      return NextResponse.json({ message: "Payment intent does not belong to this user" }, { status: 403 });
    }

    // Prevent duplicate order creation for same payment intent
    const existing = await prisma.order.findUnique({ where: { paymentIntentId } });
    if (existing) {
      return NextResponse.json({ order: formatOrder(existing) });
    }

    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        paymentIntentId,
        paymentStatus: "PAID",
        status: "PROCESSING",
        subtotal,
        shippingCost,
        total,
        shippingName: shipping.name,
        shippingPhone: shipping.phone,
        shippingStreet: shipping.street,
        shippingApt: shipping.apt ?? null,
        shippingCity: shipping.city,
        shippingState: shipping.state ?? null,
        shippingCountry: shipping.country,
        shippingPostal: shipping.postal,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            imageUrl: item.imageUrl,
            size: item.size,
            color: item.color,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: orderInclude,
    });

    // Clear user's cart after successful order
    const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ order: formatOrder(order) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
