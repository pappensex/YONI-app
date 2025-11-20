import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { STATE_COOKIE_NAME } from '../constants';

function redirectWithStateReset(req: NextRequest, path: string) {
  const response = NextResponse.redirect(new URL(path, req.url));
  response.cookies.set(STATE_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return response;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const cookieStore = cookies();
  const storedState = cookieStore.get(STATE_COOKIE_NAME)?.value;

  if (!code) return redirectWithStateReset(req, '/?auth=missing_code');
  if (!state || !storedState || !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState)))
    return redirectWithStateReset(req, '/?auth=state_mismatch');

  const clientId = process.env.GITHUB_APP_CLIENT_ID;
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return redirectWithStateReset(req, '/?auth=missing_env');
  }

  // Exchange code → access token (GitHub OAuth for GitHub App)
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      state
    })
  });

  if (!res.ok) {
    return redirectWithStateReset(req, '/?auth=token_exchange_failed');
  }

  const data = await res.json();

  if (data?.error || !data?.access_token) {
    return redirectWithStateReset(req, '/?auth=token_exchange_failed');
  }

  return redirectWithStateReset(req, '/?auth=ok&provider=github&x=148');
}
