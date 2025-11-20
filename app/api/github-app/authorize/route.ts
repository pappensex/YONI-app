import crypto from "crypto";
import { NextResponse } from "next/server";
import { STATE_COOKIE_NAME } from "../constants";

export async function GET() {
  const clientId = process.env.GITHUB_APP_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_APP_CLIENT_ID is not configured" },
      { status: 500 },
    );
  }

  const state = crypto.randomBytes(16).toString("hex");
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });

  return response;
}
