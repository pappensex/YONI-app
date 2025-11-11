# YONI App - Stripe Webhook Integration

This Next.js application provides a Stripe webhook endpoint for handling Stripe events.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Stripe credentials:
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Running the Development Server

Start the development server on port 3000:
```bash
npm run dev -p 3000
```

Or use the default port (3000):
```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## API Endpoints

### Stripe Webhook: `/api/stripe/webhook`

#### POST
Handles Stripe webhook events with signature verification.

**Headers:**
- `stripe-signature`: Stripe webhook signature (required)

**Request Body:**
Raw Stripe webhook event payload

**Responses:**
- `200 OK`: Event received and processed successfully
- `400 Bad Request`: Invalid signature or missing signature header
- `500 Internal Server Error`: Server configuration error

**Example (testing with invalid signature):**
```bash
curl -s http://localhost:3000/api/stripe/webhook \
  -X POST \
  -H "stripe-signature: invalid" \
  -d '{}'
```

**Response:**
```
Webhook Error: Invalid signature
```

#### GET
Health check endpoint to verify the webhook is active.

**Response:**
```
Webhook endpoint active (use POST from Stripe).
```

## Supported Stripe Events

The webhook currently handles the following Stripe events:
- `checkout.session.completed`: Triggered when a checkout session is completed
- `payment_intent.succeeded`: Triggered when a payment succeeds

Additional events are logged but not specifically handled.

## Security

- All webhook requests are verified using Stripe's webhook signature verification
- Error messages are generic to prevent information disclosure
- Detailed errors are logged to the console for debugging
- No dependencies with known vulnerabilities (verified with npm audit and GitHub Advisory Database)

## Building for Production

```bash
npm run build
npm start
```

## Testing in Codespaces

1. Create a new Codespace on the repository
2. In the terminal, run:
```bash
npm install
npm run dev -- -p 3000
```
3. Make port 3000 public in the Ports panel
4. Test the webhook endpoint using the public URL

## Development

- TypeScript is used for type safety
- Next.js 14.2 with App Router
- React 18.3
- Stripe SDK 16.12

## License

See repository license.
