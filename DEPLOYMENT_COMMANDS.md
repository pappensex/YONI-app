# 🚀 Quick Reference: Production Deployment Commands

> Schnellzugriff für häufig verwendete Deployment-Befehle

---

## 📦 Vercel Deployment

```bash
# Production Deployment
vercel --prod

# Preview Deployment
vercel

# Force Redeploy (z.B. nach Env-Variable-Änderung)
vercel --prod --force

# Projekt verknüpfen (einmalig)
vercel link

# Deployments auflisten
vercel ls

# Logs anzeigen
vercel logs
```

---

## 🌍 Domain Management

```bash
# Domain hinzufügen
vercel domains add app.pihoch2.me
vercel domains add api.pihoch2.me
vercel domains add pihoch2.me

# Domains auflisten
vercel domains ls

# Domain entfernen
vercel domains rm alte-domain.com
```

---

## 🔐 Environment Variables

```bash
# Alle Env-Variablen auflisten
vercel env ls

# Variable hinzufügen (Production)
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production

# Variable entfernen
vercel env rm VARIABLE_NAME production

# Alle Env-Variablen für Production setzen (nach .env.example)
vercel env add STRIPE_SECRET_KEY production
# → Wert: sk_live_xxxxx

vercel env add STRIPE_WEBHOOK_SECRET production
# → Wert: whsec_xxxxx

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# → Wert: pk_live_xxxxx

vercel env add NEXT_PUBLIC_APP_URL production
# → Wert: https://app.pihoch2.me
```

---

## 💳 Stripe Webhook Management

```bash
# Stripe CLI installieren (macOS)
brew install stripe/stripe-cli/stripe

# Stripe Login
stripe login

# Webhooks auflisten
stripe webhooks list

# Test-Event senden
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded

# Webhook erstellen
stripe listen --forward-to https://app.pihoch2.me/api/stripe/webhook

# Webhook permanent erstellen
stripe webhooks create \
  --url https://app.pihoch2.me/api/stripe/webhook \
  --enabled-events checkout.session.completed,payment_intent.succeeded
```

---

## 🔍 DNS Verification

```bash
# App-Subdomain überprüfen
nslookup app.pihoch2.me
dig app.pihoch2.me

# Root Domain überprüfen
nslookup pihoch2.me
dig pihoch2.me

# DMARC überprüfen
dig _dmarc.pihoch2.me TXT

# SPF überprüfen
dig pihoch2.me TXT

# DKIM überprüfen
dig s1._domainkey.pihoch2.me CNAME
dig s2._domainkey.pihoch2.me CNAME

# Global DNS-Propagation
# → https://dnschecker.org
# → https://whatsmydns.net
```

---

## ✅ Production Healthcheck

```bash
# 1. Domain erreichbar?
curl -I https://app.pihoch2.me
curl -I https://pihoch2.me

# 2. Webhook-Endpoint aktiv?
curl https://app.pihoch2.me/api/stripe/webhook
# Sollte zurückgeben: "Webhook endpoint active"

# 3. Environment Variables gesetzt?
vercel env ls

# 4. Letztes Deployment OK?
vercel ls | head -5

# 5. Logs checken
vercel logs

# 6. Stripe Webhook Test
stripe trigger checkout.session.completed
```

---

## 🏗️ Build & Test (Lokal)

```bash
# Dependencies installieren
npm install

# Linting
npm run lint

# Build (Production-Modus)
npm run build

# Development Server starten
npm run dev

# Nach Build: Start Production Server lokal
npm start
```

---

## 🔄 Kompletter Production Deployment Flow

```bash
# 1. Code-Änderungen committen
git add .
git commit -m "Beschreibung der Änderung"
git push origin main

# 2. Lokal testen (optional)
npm run build
npm start

# 3. Production Deployment
vercel --prod

# 4. Deployment überprüfen
vercel ls
curl -I https://app.pihoch2.me

# 5. Logs checken
vercel logs

# 6. Webhook testen (falls Stripe-Änderungen)
stripe trigger checkout.session.completed
```

---

## 🐛 Troubleshooting Commands

```bash
# Build-Fehler debuggen
npm run build

# Vercel Logs live anzeigen
vercel logs --follow

# DNS-Cache leeren (macOS)
sudo dscacheutil -flushcache

# DNS-Cache leeren (Linux)
sudo systemd-resolve --flush-caches

# Alle Deployments auflisten (inkl. Fehler)
vercel ls --all

# Spezifisches Deployment inspizieren
vercel inspect <deployment-url>

# Rollback zum vorherigen Deployment
vercel rollback
```

---

## 📊 Monitoring & Analytics

```bash
# Deployment-Status
vercel ls

# Projekt-Info
vercel inspect

# Logs anzeigen (letzte 100 Zeilen)
vercel logs --limit 100

# Logs für spezifisches Deployment
vercel logs <deployment-url>

# Live-Logs (Follow-Modus)
vercel logs --follow
```

---

## 🔗 Wichtige URLs

### Vercel
- Dashboard: https://vercel.com/dashboard
- Projekt-Settings: https://vercel.com/pihoch2/yoni-app/settings
- Domains: https://vercel.com/pihoch2/yoni-app/settings/domains
- Environment Variables: https://vercel.com/pihoch2/yoni-app/settings/environment-variables

### Stripe
- Dashboard: https://dashboard.stripe.com
- Webhooks: https://dashboard.stripe.com/webhooks
- API Keys: https://dashboard.stripe.com/apikeys
- Payments: https://dashboard.stripe.com/payments

### DNS-Tools
- DMARC-Check: https://mxtoolbox.com/dmarc.aspx
- DNS-Propagation: https://dnschecker.org
- Global DNS-Check: https://whatsmydns.net

### IONOS (DNS-Provider)
- Login: https://www.ionos.de/login
- DNS-Verwaltung: Domain auswählen → DNS-Einstellungen

---

## 📝 Checkliste: Initial Production Setup

```bash
# 1. Vercel CLI installieren
npm i -g vercel

# 2. Login
vercel login

# 3. Projekt verknüpfen
cd YONI-app
vercel link

# 4. Environment Variables setzen
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production

# 5. Domains hinzufügen
vercel domains add pihoch2.me
vercel domains add app.pihoch2.me
vercel domains add api.pihoch2.me

# 6. DNS bei IONOS konfigurieren
# → Siehe PRODUCTION_SETUP.md Abschnitt 1 & 4

# 7. Stripe Webhook erstellen
stripe login
stripe webhooks create \
  --url https://app.pihoch2.me/api/stripe/webhook \
  --enabled-events checkout.session.completed,payment_intent.succeeded

# 8. Webhook Secret in Vercel setzen
# → Kopiere Secret von Stripe Dashboard
vercel env add STRIPE_WEBHOOK_SECRET production

# 9. Production Deployment
vercel --prod

# 10. Healthcheck
curl https://app.pihoch2.me/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## 🆘 Notfall-Befehle

```bash
# Deployment sofort stoppen/rollback
vercel rollback

# Alle Environment Variables neu setzen
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production

# Force Redeploy (bei Cache-Problemen)
vercel --prod --force

# Domain komplett neu konfigurieren
vercel domains rm app.pihoch2.me
vercel domains add app.pihoch2.me
# → DNS neu setzen bei IONOS

# Vercel-Projekt komplett neu verknüpfen
rm -rf .vercel
vercel link
vercel --prod
```

---

> Für detaillierte Erklärungen siehe [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)

**YONI App** – Sicherer Raum für mentale Gesundheit ✨
