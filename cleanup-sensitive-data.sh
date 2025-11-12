#!/bin/bash
set -e

# ==============================================================================
# YONI Repository Security Cleanup Script
# ==============================================================================
# This script removes sensitive data from the entire git history.
# 
# ⚠️ WARNING: This script REWRITES GIT HISTORY and requires FORCE PUSH
# 
# BEFORE RUNNING:
# 1. Ensure all team members have pushed their work
# 2. Create a backup of the repository
# 3. Coordinate with all team members - they will need to re-clone
# 4. Have permissions to force-push to protected branches
#
# AFTER RUNNING:
# 1. All team members must re-clone the repository or force-fetch
# 2. Rotate all secrets that may have been exposed
# ==============================================================================

echo "======================================================================"
echo "🔒 YONI Repository Security Cleanup"
echo "======================================================================"
echo ""
echo "This script will:"
echo "  ✓ Remove *.pem, *.key, *.p12, *.env files from git history"
echo "  ✓ Redact API keys and secrets from commits"
echo "  ✓ Clean up git references and run garbage collection"
echo "  ✓ Force push cleaned history to remote"
echo ""
echo "⚠️  WARNING: This REWRITES GIT HISTORY"
echo ""
read -p "Do you want to continue? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "Aborted."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if git-filter-repo is installed
if ! command -v git-filter-repo &> /dev/null; then
    echo "📦 Installing git-filter-repo..."
    pip install git-filter-repo
fi

# Create backup
BACKUP_DIR="../YONI-app.backup.$(date +%Y%m%d-%H%M%S)"
echo "💾 Creating backup at: $BACKUP_DIR"
cd ..
cp -a YONI-app "$BACKUP_DIR"
cd YONI-app

echo ""
echo "======================================================================"
echo "🗑️  Step 1: Removing sensitive files from git history"
echo "======================================================================"
git filter-repo --force --invert-paths \
  --path .env \
  --path-glob "*.env" \
  --path-glob "*.pem" \
  --path-glob "*.key" \
  --path-glob "*.p12" \
  --path api/stripe/webhook/route.js \
  --path api/stripe/webhook/route.ts

echo ""
echo "======================================================================"
echo "🔐 Step 2: Redacting secret patterns from git history"
echo "======================================================================"

# Create replacement patterns file
cat > replace.txt <<'EOF'
regex:^sk-[A-Za-z0-9]{20,}==>REDACTED_OPENAI
regex:^whsec_[A-Za-z0-9]{24,}==>REDACTED_STRIPE_WH
regex:ghp_[A-Za-z0-9]{36,}==>REDACTED_GITHUB
regex:github_pat_[A-Za-z0-9_]{20,}==>REDACTED_GITHUB_PAT
regex:AKIA[0-9A-Z]{16}==>REDACTED_AWS
regex:ASIA[0-9A-Z]{16}==>REDACTED_AWS_ASIA
EOF

git filter-repo --force --replace-text replace.txt

echo ""
echo "======================================================================"
echo "🧹 Step 3: Cleaning up git references and garbage collection"
echo "======================================================================"

# Clean up original refs
git for-each-ref --format='delete %(refname)' refs/original/ | git update-ref --stdin 2>/dev/null || true

# Expire reflog
git reflog expire --expire=now --all

# Aggressive garbage collection
git gc --prune=now --aggressive

# Restore webhook route with clean version (uses environment variables)
echo ""
echo "📄 Restoring clean webhook route file..."
mkdir -p api/stripe/webhook
cat > api/stripe/webhook/route.ts <<'ROUTE_TS'
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    })
  : null;

export async function POST(req: Request) {
  if (!stripe) {
    return new Response("Stripe not configured", { status: 500 });
  }
  
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }
  
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("✅ Checkout completed:", event.data.object.id);
      break;
    case "payment_intent.succeeded":
      console.log("💰 Payment succeeded:", event.data.object.id);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  return new Response("Webhook endpoint active (use POST from Stripe).", {
    status: 200,
  });
}
ROUTE_TS

# Add replace.txt to .gitignore
if ! grep -q "replace.txt" .gitignore 2>/dev/null; then
    echo "replace.txt" >> .gitignore
fi

# Add and commit the changes
git add .gitignore api/stripe/webhook/route.ts
git commit -m "Restore clean webhook route and update .gitignore" || true

# Re-add remote (git-filter-repo removes it)
echo ""
echo "🔗 Restoring remote connection..."
git remote add origin https://github.com/pappensex/YONI-app 2>/dev/null || \
git remote set-url origin https://github.com/pappensex/YONI-app

echo ""
echo "======================================================================"
echo "✅ Cleanup Complete!"
echo "======================================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Review the changes:"
echo "   git log --oneline -10"
echo "   git status"
echo ""
echo "2. Force push to remote (THIS WILL REWRITE HISTORY):"
echo "   git push --force-with-lease origin main"
echo ""
echo "   For other branches, repeat:"
echo "   git push --force-with-lease origin <branch-name>"
echo ""
echo "3. Force push tags (if any):"
echo "   git push --force-with-lease --tags"
echo ""
echo "4. Notify all team members to:"
echo "   - Delete their local copies"
echo "   - Re-clone the repository: git clone https://github.com/pappensex/YONI-app"
echo "   OR"
echo "   - Force fetch: git fetch origin --force && git reset --hard origin/main"
echo ""
echo "5. Rotate all potentially exposed secrets:"
echo "   - GitHub App private key (yoni-x148.2025-11-03.private-key.pem)"
echo "   - Any other secrets that were in the removed files"
echo ""
echo "⚠️  Backup saved at: $BACKUP_DIR"
echo ""
echo "======================================================================"
