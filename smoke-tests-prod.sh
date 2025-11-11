#!/bin/bash
# Smoke Tests for Production Deployment
# This script demonstrates the smoke tests mentioned in the problem statement

echo "==================================="
echo "Production Deployment Smoke Tests"
echo "==================================="
echo ""

# Set production domain (replace with actual production domain)
PROD_DOMAIN="${PROD_DOMAIN:-yoni-app.vercel.app}"

echo "Testing against: https://${PROD_DOMAIN}"
echo ""

# Test 1: Stripe webhook with invalid signature
echo "1. Testing Stripe webhook with invalid signature..."
echo "   curl -s https://${PROD_DOMAIN}/api/stripe/webhook -X POST -H 'stripe-signature: invalid' -d '{}'"
echo ""
STRIPE_RESPONSE=$(curl -s https://${PROD_DOMAIN}/api/stripe/webhook -X POST -H "stripe-signature: invalid" -d '{}')
echo "   Response: $STRIPE_RESPONSE"
echo ""

# Test 2: GitHub webhook with valid signature
echo "2. Testing GitHub webhook with valid signature..."
if [ -z "$GITHUB_WEBHOOK_SECRET" ]; then
  echo "   ⚠️  GITHUB_WEBHOOK_SECRET not set. Using test value."
  GITHUB_WEBHOOK_SECRET="test-secret-for-demo"
fi

PAYLOAD='{}'
SIG=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$GITHUB_WEBHOOK_SECRET" -r | cut -d' ' -f1)

echo "   curl -s https://${PROD_DOMAIN}/api/github-app/webhook -H 'x-github-event: ping' -H 'x-hub-signature-256: sha256=\$SIG' -H 'content-type: application/json' -d '{}'"
echo ""
GITHUB_RESPONSE=$(curl -s https://${PROD_DOMAIN}/api/github-app/webhook -H "x-github-event: ping" -H "x-hub-signature-256: sha256=$SIG" -H "content-type: application/json" -d "$PAYLOAD")
echo "   Response: $GITHUB_RESPONSE"
echo ""

# Test 3: GitHub webhook with invalid signature
echo "3. Testing GitHub webhook with invalid signature..."
echo "   curl -s https://${PROD_DOMAIN}/api/github-app/webhook -X POST -H 'x-hub-signature-256: sha256=invalid' -d '{}'"
echo ""
GITHUB_INVALID_RESPONSE=$(curl -s https://${PROD_DOMAIN}/api/github-app/webhook -X POST -H "x-github-event: ping" -H "x-hub-signature-256: sha256=invalid" -H "content-type: application/json" -d '{}')
echo "   Response: $GITHUB_INVALID_RESPONSE"
echo ""

echo "==================================="
echo "Smoke tests completed!"
echo "==================================="
