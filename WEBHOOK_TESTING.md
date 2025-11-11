# YONI App - Stripe Webhook Testing

This Next.js application includes a Stripe webhook endpoint for testing webhook signature validation.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Stripe credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your actual Stripe keys:
```
STRIPE_SECRET_KEY=sk_test_your_actual_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret
```

## Running the Application

Start the development server:
```bash
npm run dev -- -p 3000
```

The application will be available at `http://localhost:3000`

## Testing the Webhook Endpoint

### Test with Invalid Signature

```bash
curl -i http://localhost:3000/api/stripe/webhook -X POST -H "stripe-signature: invalid" -d '{}'
```

Expected response:
```
HTTP/1.1 400 Bad Request
Content-Type: text/plain;charset=UTF-8

Webhook signature verification failed
```

### Test with GET Request

```bash
curl http://localhost:3000/api/stripe/webhook
```

Expected response:
```
Webhook endpoint active (use POST from Stripe).
```

## Webhook Endpoint

- **URL**: `/api/stripe/webhook`
- **Methods**: 
  - `GET`: Returns status message
  - `POST`: Validates Stripe webhook signature and processes events

### Security Features

- Validates Stripe signature on all POST requests
- Returns generic error messages to clients
- Logs detailed error information to console for debugging
- No exposure of internal error details that could be exploited

## Codespaces Usage

In GitHub Codespaces:
1. The port 3000 will be automatically forwarded
2. Make it public to test with external webhooks
3. Access via: `$CODESPACE_NAME-3000.app.github.dev/api/stripe/webhook`

## Supported Stripe Events

The webhook currently handles:
- `checkout.session.completed`
- `payment_intent.succeeded`
- Other events are logged but not processed

## Error Handling

- Missing signature: Returns 400 with "Missing signature"
- Invalid signature: Returns 400 with "Webhook signature verification failed"
- Successful validation: Returns 200 with `{"received": true}`
