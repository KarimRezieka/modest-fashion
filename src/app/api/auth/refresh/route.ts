import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("refresh_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const payload = verifyRefreshToken(token);

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
    }

    await prisma.refreshToken.delete({ where: { token } });

    const newPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const accessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const response = NextResponse.json({ tokens: { accessToken } });

    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
