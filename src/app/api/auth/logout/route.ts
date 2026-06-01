import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("refresh_token");
    return response;
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
