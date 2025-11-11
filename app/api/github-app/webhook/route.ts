import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function verify(sigHeader: string | null, body: string) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return false;
  const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return sigHeader === `sha256=${hmac}`;
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-hub-signature-256');
  if (!verify(sig, raw)) return new NextResponse('invalid signature', { status: 401 });

  const evt = req.headers.get('x-github-event');
  
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new NextResponse('invalid JSON', { status: 400 });
  }

  // Simple demo: auto-comment on new PRs
  if (evt === 'pull_request' && payload.action === 'opened') {
    await fetch(`https://api.github.com/repos/${payload.repository.full_name}/issues/${payload.number}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_APP_INSTALLATION_TOKEN ?? ''}`,
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({ body: `👋 ${process.env.X148_ALIAS} hier. PR empfangen und in Prüfung.` })
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
