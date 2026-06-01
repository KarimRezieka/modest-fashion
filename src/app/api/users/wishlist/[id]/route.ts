import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const item = await prisma.wishlistItem.findFirst({ where: { id, userId: user.userId } });
  if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

  await prisma.wishlistItem.delete({ where: { id } });

  return NextResponse.json({ message: "Removed from wishlist" });
}
