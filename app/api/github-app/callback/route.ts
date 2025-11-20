import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  const storedState = req.cookies.get('github_oauth_state')?.value;
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL('/?auth=invalid_state', req.url));
  }

  if (!code) return NextResponse.redirect(new URL('/?auth=missing_code', req.url));

  const clientId = process.env.GITHUB_APP_CLIENT_ID;
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?auth=server_error', req.url));
  }

  // Exchange code → access token (GitHub OAuth for GitHub App)
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      state: state ?? ''
    })
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/?auth=token_exchange_failed', req.url));
  }

  const data = await res.json();
  if (!data || data.error || !data.access_token) {
    return NextResponse.redirect(new URL('/?auth=token_exchange_failed', req.url));
  }

  // Persist token (per user/installation) – store securely.
  // For demo we just echo status.
  const response = NextResponse.redirect(new URL('/?auth=ok&provider=github&x=148', req.url));
  response.cookies.set('github_oauth_state', '', { maxAge: 0, path: '/' });

  return response;
}
