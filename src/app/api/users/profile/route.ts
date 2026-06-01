import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-guard";
import { updateProfileSchema } from "@/lib/validations/user";

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const profile = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, email: true, name: true, image: true, phone: true, role: true, provider: true, createdAt: true },
  });

  if (!profile) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({ user: profile });
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: parsed.data,
      select: { id: true, email: true, name: true, image: true, phone: true, role: true, provider: true },
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
