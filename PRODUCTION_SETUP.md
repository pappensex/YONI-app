# 🚀 YONI App – Production Setup Guide

> Vollständige Anleitung für Production Deployment mit Custom Domain, DNS, Stripe Integration
> 
> **Stand:** 2025-11-13  
> **Domain:** app.pihoch2.me  
> **Email:** yoni@pihoch2.me

---

## 📋 Übersicht

Dieser Guide beschreibt den kompletten Setup-Prozess für die YONI App in Production:

1. **DNS-Konfiguration** für Email (DMARC, SPF, DKIM)
2. **Stripe Integration** (API-Keys, Webhooks)
3. **Vercel Deployment** mit Custom Domains
4. **GitHub → Vercel → Stripe** Verzahnung

---

## 🌐 1. DNS-Konfiguration (Email Security)

### 1.1 DMARC Record

DMARC (Domain-based Message Authentication) schützt vor Email-Spoofing.

**DNS-Eintrag bei deinem Provider (z.B. IONOS) hinzufügen:**

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:postmaster@pihoch2.me; fo=1
TTL: 3600
```

**Erklärung:**
- `v=DMARC1` – DMARC Version 1
- `p=quarantine` – Verdächtige Emails werden in Quarantäne verschoben
- `rua=mailto:postmaster@pihoch2.me` – Berichte werden an diese Adresse gesendet
- `fo=1` – Berichte bei allen Fehlern generieren

### 1.2 SPF Record

SPF (Sender Policy Framework) definiert, welche Server Emails für deine Domain senden dürfen.

**DNS-Eintrag:**

```
Type: TXT
Name: @ (oder pihoch2.me)
Value: v=spf1 include:_spf.mail.ionos.com ~all
TTL: 3600
```

**Erklärung:**
- `v=spf1` – SPF Version 1
- `include:_spf.mail.ionos.com` – IONOS Mail-Server sind autorisiert
- `~all` – Alle anderen Server werden als "soft fail" markiert

### 1.3 DKIM Setup

DKIM (DomainKeys Identified Mail) signiert Emails kryptografisch.

**Schritte:**

1. **In IONOS aktivieren:**
   - Login bei IONOS → Email & Office
   - Wähle deine Domain: `pihoch2.me`
   - Gehe zu "Email-Einstellungen" → "DKIM"
   - Klicke "DKIM aktivieren"

2. **CNAME-Records setzen:**
   
   IONOS stellt dir 2 CNAME-Records bereit (Beispiel-Format):
   
   ```
   Type: CNAME
   Name: s1._domainkey
   Value: s1.domainkey.XXXXXX.ionos.de
   TTL: 3600
   
   Type: CNAME
   Name: s2._domainkey
   Value: s2.domainkey.XXXXXX.ionos.de
   TTL: 3600
   ```
   
   **Hinweis:** Die genauen Werte bekommst du von IONOS nach Aktivierung.

3. **Verifizierung:**
   ```bash
   # Überprüfe DKIM-Record
   dig s1._domainkey.pihoch2.me CNAME
   dig s2._domainkey.pihoch2.me CNAME
   ```

### 1.4 DNS-Propagation überprüfen

Nach dem Setzen der Records:

```bash
# DMARC überprüfen
dig _dmarc.pihoch2.me TXT

# SPF überprüfen
dig pihoch2.me TXT

# DKIM überprüfen
dig s1._domainkey.pihoch2.me CNAME
```

**Hinweis:** DNS-Änderungen können 5-30 Minuten bis 48 Stunden dauern.

---

## 💳 2. Stripe Integration

### 2.1 Stripe Account Setup

1. **Stripe Dashboard öffnen:** [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Account aktivieren** (falls noch im Test-Modus)
3. **API-Keys abrufen:**
   - Gehe zu "Developers" → "API keys"
   - Kopiere:
     - `Publishable key` (startet mit `pk_live_...` für Production)
     - `Secret key` (startet mit `sk_live_...` für Production)

### 2.2 Umgebungsvariablen

**Erforderliche Environment Variables:**

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `STRIPE_SECRET_KEY` | Secret API Key von Stripe | `sk_live_xxxxx` oder `sk_test_xxxxx` |
| `STRIPE_WEBHOOK_SECRET` | Webhook Signing Secret | `whsec_xxxxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public API Key | `pk_live_xxxxx` oder `pk_test_xxxxx` |
| `NEXT_PUBLIC_APP_URL` | Production App URL | `https://app.pihoch2.me` |

### 2.3 Stripe Webhooks konfigurieren

**Webhook-Endpoint:** `https://app.pihoch2.me/api/stripe/webhook`

#### Webhook in Stripe Dashboard erstellen:

1. **Gehe zu Stripe Dashboard:**
   - [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)

2. **Add endpoint:**
   - Endpoint URL: `https://app.pihoch2.me/api/stripe/webhook`
   - Description: `YONI App Production Webhook`
   
3. **Events auswählen:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed` (optional)
   - `customer.created` (optional)

4. **Webhook erstellen & Secret kopieren:**
   - Nach dem Erstellen zeigt Stripe das Signing Secret: `whsec_xxxxx`
   - **Wichtig:** Dieses Secret sofort kopieren und als `STRIPE_WEBHOOK_SECRET` speichern!

#### Webhook via CLI erstellen (Alternative):

```bash
# Stripe CLI installieren (falls nicht vorhanden)
brew install stripe/stripe-cli/stripe
# oder: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Webhook erstellen
stripe listen --forward-to https://app.pihoch2.me/api/stripe/webhook

# Oder permanent erstellen:
stripe webhooks create \
  --url https://app.pihoch2.me/api/stripe/webhook \
  --enabled-events checkout.session.completed,payment_intent.succeeded
```

#### Webhooks auflisten:

```bash
stripe webhooks list
```

### 2.4 Webhook-Endpunkt testen

Die Webhook-Route ist bereits implementiert in:
- **Datei:** `api/stripe/webhook/route.ts`
- **URL:** `https://app.pihoch2.me/api/stripe/webhook`

**Test durchführen:**

```bash
# GET-Request (Healthcheck)
curl https://app.pihoch2.me/api/stripe/webhook

# Sollte zurückgeben: "Webhook endpoint active"
```

**Stripe Test-Event senden:**

```bash
# Via Stripe CLI
stripe trigger checkout.session.completed
```

---

## ☁️ 3. Vercel Production Deployment

### 3.1 Vercel Environment Variables setzen

**Via Vercel CLI:**

```bash
# Vercel CLI installieren (falls nicht vorhanden)
npm i -g vercel

# Login
vercel login

# Projekt verknüpfen
cd YONI-app
vercel link

# Environment Variables hinzufügen
vercel env add STRIPE_SECRET_KEY production
# → Wert eingeben: sk_live_xxxxx

vercel env add STRIPE_WEBHOOK_SECRET production
# → Wert eingeben: whsec_xxxxx

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# → Wert eingeben: pk_live_xxxxx

vercel env add NEXT_PUBLIC_APP_URL production
# → Wert eingeben: https://app.pihoch2.me
```

**Via Vercel Dashboard:**

1. Gehe zu: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Wähle Projekt: `yoni-app`
3. Settings → Environment Variables
4. Füge jede Variable hinzu:
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_live_xxxxx`
   - Environment: `Production` ✓

**Environment Variables auflisten:**

```bash
vercel env ls
```

**Wichtig:** Nach dem Hinzufügen von Env-Variablen **neu deployen**:

```bash
vercel --prod
```

### 3.2 Production Deployment

**Deployment ausführen:**

```bash
cd YONI-app
vercel --prod
```

**Typische Ausgabe:**

```
🔍  Inspect: https://vercel.com/pihoch2/yoni-app/xxxxxx
✅  Production: https://yoni-app-pihoch2.vercel.app [copied to clipboard]
```

---

## 🌍 4. Custom Domain Setup

### 4.1 Domains bei Vercel hinzufügen

**Drei Domains konfigurieren:**

1. **Root Domain:** `pihoch2.me`
2. **App Subdomain:** `app.pihoch2.me` (Hauptdomain für die App)
3. **API Subdomain:** `api.pihoch2.me` (optional, falls separate API)

**Via CLI:**

```bash
# Root Domain
vercel domains add pihoch2.me

# App Subdomain (Primary)
vercel domains add app.pihoch2.me

# API Subdomain (falls benötigt)
vercel domains add api.pihoch2.me
```

**Via Dashboard:**

1. Vercel Projekt öffnen
2. Settings → Domains
3. "Add Domain" klicken
4. Domain eingeben: `app.pihoch2.me`
5. DNS-Anweisungen folgen

### 4.2 DNS-Konfiguration bei IONOS

**CNAME-Records erstellen:**

Bei deinem DNS-Provider (IONOS) folgende Records hinzufügen:

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: api
Value: cname.vercel-dns.com
TTL: 3600
```

**Root Domain (pihoch2.me):**

Für Root-Domain nutze A-Record (oder ALIAS bei unterstützten Providern):

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Hinweis:** Vercel stellt die genauen DNS-Werte im Dashboard bereit nach dem Hinzufügen der Domain.

### 4.3 DNS-Verifizierung

**DNS-Propagation überprüfen:**

```bash
# App-Subdomain
nslookup app.pihoch2.me
dig app.pihoch2.me

# Root Domain
nslookup pihoch2.me
dig pihoch2.me

# API-Subdomain
nslookup api.pihoch2.me
```

**Erwartete Ausgabe:**

```
app.pihoch2.me canonical name = cname.vercel-dns.com.
cname.vercel-dns.com has address 76.76.21.21
```

### 4.4 SSL-Zertifikat

Vercel generiert automatisch kostenlose SSL-Zertifikate via **Let's Encrypt**.

**Überprüfung:**

1. Gehe zu Vercel Dashboard → Domains
2. Stelle sicher, dass neben jeder Domain ein grünes ✓ erscheint
3. Status sollte "Valid" oder "Active" sein

**SSL via Browser testen:**

```bash
# HTTPS-Aufruf
curl -I https://app.pihoch2.me
# Sollte 200 OK oder 301/302 zurückgeben
```

---

## 🔄 5. GitHub → Vercel → Stripe Verzahnung

### 5.1 Workflow Overview

```
┌─────────────┐
│   GitHub    │ (Code Push)
│   Repo      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Vercel    │ (Auto-Deploy)
│   Platform  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Stripe    │ (Webhook Events)
│   Payment   │
└─────────────┘
```

### 5.2 GitHub Secrets konfigurieren

**Falls GitHub Actions genutzt werden:**

Gehe zu GitHub Repo → Settings → Secrets and variables → Actions

Füge hinzu:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für Details.

### 5.3 Deployment-Flow testen

1. **Code-Änderung pushen:**
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```

2. **Vercel Deployment beobachten:**
   - Gehe zu [vercel.com/dashboard](https://vercel.com/dashboard)
   - Oder: `vercel ls`

3. **Webhook testen:**
   ```bash
   curl https://app.pihoch2.me/api/stripe/webhook
   # Sollte "Webhook endpoint active" zurückgeben
   ```

4. **Stripe Test-Payment:**
   - Öffne `https://app.pihoch2.me`
   - Führe Test-Checkout durch
   - Überprüfe Stripe Dashboard → Payments
   - Überprüfe Vercel Logs für Webhook-Events

---

## 📊 6. Production Healthcheck

### 6.1 Komplette Checkliste

Nach dem Setup alle Punkte überprüfen:

- [ ] DNS-Records korrekt gesetzt (DMARC, SPF, DKIM)
- [ ] DNS-Propagation abgeschlossen (via `dig` oder `nslookup`)
- [ ] Stripe API-Keys in Vercel Environment Variables
- [ ] Stripe Webhook erstellt und aktiv
- [ ] `NEXT_PUBLIC_APP_URL=https://app.pihoch2.me` gesetzt
- [ ] Vercel Domains hinzugefügt: `pihoch2.me`, `app.pihoch2.me`, `api.pihoch2.me`
- [ ] SSL-Zertifikate aktiv (grüner Status in Vercel)
- [ ] Production Deployment erfolgreich: `vercel --prod`
- [ ] Webhook-Endpoint erreichbar: `curl https://app.pihoch2.me/api/stripe/webhook`
- [ ] GitHub → Vercel Auto-Deploy funktioniert
- [ ] Stripe Test-Payment erfolgreich
- [ ] Email-Funktionalität getestet (optional)

### 6.2 Finale Tests

**1. Domain-Erreichbarkeit:**

```bash
curl -I https://app.pihoch2.me
curl -I https://pihoch2.me
curl -I https://api.pihoch2.me
```

**2. Stripe Webhook:**

```bash
# Healthcheck
curl https://app.pihoch2.me/api/stripe/webhook

# Test-Event via CLI
stripe trigger checkout.session.completed
```

**3. Production Deployment:**

```bash
vercel --prod
# Sollte erfolgreich deployen und URL zurückgeben
```

**4. Environment Variables:**

```bash
vercel env ls
# Sollte alle Stripe-Variablen für Production anzeigen
```

### 6.3 TikTok-Shop Integration (Optional)

Falls TikTok-Shop genutzt wird:

1. Gehe zu TikTok Seller Center
2. Shop-URL ändern zu: `https://app.pihoch2.me`
3. Verifizierung durchführen
4. Payment-Flow testen

---

## 🔧 7. Troubleshooting

### DNS funktioniert nicht

**Problem:** Domain zeigt nicht auf Vercel

**Lösung:**
```bash
# DNS-Cache leeren
sudo dscacheutil -flushcache  # macOS
sudo systemd-resolve --flush-caches  # Linux

# DNS-Propagation überprüfen
dig app.pihoch2.me
nslookup app.pihoch2.me

# 5-30 Minuten warten und erneut testen
```

### Stripe Webhook schlägt fehl

**Problem:** Webhook-Events werden nicht empfangen

**Lösung:**
1. Überprüfe Webhook-URL in Stripe Dashboard
2. Stelle sicher `STRIPE_WEBHOOK_SECRET` in Vercel gesetzt ist
3. Teste Endpoint: `curl https://app.pihoch2.me/api/stripe/webhook`
4. Checke Vercel Logs: `vercel logs`
5. Sende Test-Event: `stripe trigger checkout.session.completed`

### Environment Variables fehlen

**Problem:** App funktioniert nicht wegen fehlenden Env-Variablen

**Lösung:**
```bash
# Alle Env-Variablen auflisten
vercel env ls

# Fehlende hinzufügen
vercel env add VARIABLE_NAME production

# Neu deployen
vercel --prod --force
```

### SSL-Zertifikat Fehler

**Problem:** HTTPS funktioniert nicht

**Lösung:**
1. Warte 5-10 Minuten nach Domain-Hinzufügung
2. Gehe zu Vercel → Domains → Klicke "Refresh"
3. Stelle sicher DNS korrekt konfiguriert ist
4. Falls weiterhin Fehler: Domain entfernen und neu hinzufügen

---

## 📝 8. Wartung & Updates

### Webhook-Endpoint aktualisieren

Falls Domain sich ändert:

```bash
# Stripe Webhook-URL updaten
stripe webhooks update <webhook_id> \
  --url https://neue-domain.com/api/stripe/webhook
```

### Environment Variables aktualisieren

```bash
# Variable aktualisieren
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production

# Neu deployen
vercel --prod
```

### Domain wechseln

```bash
# Alte Domain entfernen
vercel domains rm alte-domain.com

# Neue Domain hinzufügen
vercel domains add neue-domain.com

# DNS-Records aktualisieren
# Neu deployen
vercel --prod
```

---

## 🔗 Nützliche Links

- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Stripe Dashboard:** [dashboard.stripe.com](https://dashboard.stripe.com)
- **Stripe Webhooks:** [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
- **DNS-Tools:**
  - [mxtoolbox.com](https://mxtoolbox.com/dmarc.aspx) (DMARC-Check)
  - [dnschecker.org](https://dnschecker.org) (DNS-Propagation)
  - [whatsmydns.net](https://whatsmydns.net) (Global DNS-Check)

---

## 📞 Support

Bei Problemen:

1. Überprüfe diese Dokumentation
2. Checke Vercel Logs: `vercel logs`
3. Checke Stripe Logs im Dashboard
4. GitHub Issues: [github.com/pappensex/YONI-app/issues](https://github.com/pappensex/YONI-app/issues)
5. Email: [yoni@pihoch2.me](mailto:yoni@pihoch2.me)

---

> _„Im Dunkel des Alls glitzert jeder Mensch als eigene Galaxie."_ ✨

**YONI App** – Ein sicherer Raum für mentale Gesundheit  
Projekt: [github.com/pappensex/YONI-app](https://github.com/pappensex/YONI-app)
