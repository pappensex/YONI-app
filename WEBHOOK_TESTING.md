# YONI App - Webhook Testing Guide

This guide shows how to run and test the webhook endpoints in the YONI app.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Edit `.env` and set your actual credentials:
```env
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_stripe_webhook_secret
GITHUB_WEBHOOK_SECRET=your_actual_github_webhook_secret
```

## Running the Development Server

Start the Next.js development server on port 3000:

```bash
npm run dev -- -p 3000
```

The server will be available at `http://localhost:3000`

## Testing Webhook Endpoints

### 1. Stripe Webhook

The Stripe webhook endpoint validates the `stripe-signature` header and returns:
- **400** for invalid or missing signatures
- **200** for valid signatures

Test with invalid signature:
```bash
curl -s http://localhost:3000/api/stripe/webhook \
  -X POST \
  -H "stripe-signature: invalid" \
  -d '{}'
```

Expected response: `Webhook Error: ...` with HTTP status 400

### 2. GitHub App Webhook

The GitHub webhook endpoint validates the `x-hub-signature-256` header using HMAC-SHA256 and returns:
- **401** for invalid signatures
- **200** with `{"ok":true}` for valid signatures

Test with valid signature:
```bash
# Calculate valid signature
BODY='{}'
SIG=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$GITHUB_WEBHOOK_SECRET" -r | cut -d' ' -f1)

curl -s http://localhost:3000/api/github-app/webhook \
  -H "x-github-event: ping" \
  -H "x-hub-signature-256: sha256=$SIG" \
  -H "content-type: application/json" \
  -d "$BODY"
```

Expected response: `{"ok":true}` with HTTP status 200

Test with invalid signature:
```bash
curl -s http://localhost:3000/api/github-app/webhook \
  -X POST \
  -H "x-github-event: ping" \
  -H "x-hub-signature-256: sha256=invalid_signature" \
  -H "content-type: application/json" \
  -d '{}'
```

Expected response: `invalid signature` with HTTP status 401

## Testing in Codespaces

When running in GitHub Codespaces, use the `CODESPACE_NAME` environment variable:

```bash
# Stripe webhook
curl -s "$CODESPACE_NAME-3000.app.github.dev/api/stripe/webhook" \
  -X POST -H "stripe-signature: invalid" -d '{}' | cat

# GitHub webhook
SIG=$(echo -n '{}' | openssl dgst -sha256 -hmac $GITHUB_WEBHOOK_SECRET -r | cut -d' ' -f1)
curl -s "$CODESPACE_NAME-3000.app.github.dev/api/github-app/webhook" \
  -H "x-github-event: ping" \
  -H "x-hub-signature-256: sha256=$SIG" \
  -H "content-type: application/json" -d '{}' | cat
```

## Webhook Endpoints

- **Stripe Webhook**: `/api/stripe/webhook`
  - Handles Stripe webhook events
  - Validates signature using Stripe SDK
  - Returns 400 for invalid signatures

- **GitHub App Webhook**: `/api/github-app/webhook`  
  - Handles GitHub App webhook events
  - Validates signature using HMAC-SHA256
  - Returns 401 for invalid signatures
  - Returns `{"ok":true}` for valid requests

## Production Deployment

For production deployment on Vercel:

1. Set environment variables in Vercel dashboard
2. Deploy using `vercel` or connect your GitHub repository
3. Configure webhook URLs in Stripe and GitHub settings
