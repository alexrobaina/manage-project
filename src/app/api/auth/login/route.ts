import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, createSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (password !== adminPassword) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const session = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: session.value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.maxAge,
  });

  return Response.json({ ok: true });
}
