import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type JwtPayload } from "@/lib/jwt";

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> },
  user: JwtPayload
) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const token = authHeader.split(" ")[1];
      const user = verifyAccessToken(token);
      return handler(request, context, user);
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
  };
}

export function getUserFromRequest(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return verifyAccessToken(authHeader.split(" ")[1]);
  } catch {
    return null;
  }
}
