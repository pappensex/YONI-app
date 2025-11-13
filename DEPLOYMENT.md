# 🚀 YONI App – Deployment Guide

> Vollständige Anleitung für das Deployment der YONI App auf Vercel

**Letztes Update:** 2025-11-13  
**Projektleitung:** [@pappensex](https://github.com/pappensex)

---

## 📋 Überblick

YONI wird auf **Vercel** gehostet und nutzt deren Edge-Funktionen für optimale Performance und globale Verfügbarkeit.

Es gibt zwei Deployment-Methoden:
1. **Automatisch** via GitHub Actions (empfohlen für Production)
2. **Manuell** via Vercel CLI (für schnelle Tests und Debugging)

---

## 🔧 Voraussetzungen

### Erforderlich
- **Node.js** ≥ 18.17.0
- **npm** (kommt mit Node.js)
- **Git**
- **Vercel Account** ([vercel.com](https://vercel.com))
- **GitHub Account** (bereits vorhanden)

### Optional für manuelle Deployments
- **Vercel CLI** (wird weiter unten installiert)

---

## 🤖 Methode 1: Automatisches Deployment (GitHub Actions)

### Setup (einmalig)

1. **Vercel Projekt erstellen**
   - Gehe zu [vercel.com](https://vercel.com)
   - Klicke "Add New Project"
   - Importiere `pappensex/YONI-app` Repository
   - Wähle Framework: **Next.js**
   - Root Directory: `./` (Standard)
   - Build Command: `npm run build` (Standard)
   - Output Directory: `.next` (Standard)

2. **Vercel Token generieren**
   - Gehe zu [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Erstelle neuen Token mit Namen "YONI GitHub Actions"
   - Kopiere den Token (wird nur einmal angezeigt!)

3. **GitHub Secrets konfigurieren**
   
   Gehe zu GitHub Repository → Settings → Secrets and variables → Actions
   
   Erstelle folgende Secrets:
   
   | Secret Name | Wo finden | Beschreibung |
   |-------------|-----------|--------------|
   | `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) | Authentifizierung für Vercel API |
   | `VERCEL_ORG_ID` | Vercel Projekt Settings → General | Team/Organization ID |
   | `VERCEL_PROJECT_ID` | Vercel Projekt Settings → General | Projekt ID |

   **So findest du die IDs:**
   ```bash
   # Alternative: Via Vercel CLI
   npm i -g vercel
   vercel login
   vercel link
   # Die IDs werden in .vercel/project.json gespeichert
   cat .vercel/project.json
   ```

### Deployment ausführen

1. **Automatisch bei Push**
   - Jeder Push zu `main` triggert automatisch ein Production Deployment
   - Pull Requests erhalten Preview Deployments

2. **Manuell triggern**
   - Gehe zu GitHub → Actions
   - Wähle "Deploy YONI-app to Vercel"
   - Klicke "Run workflow"
   - Wähle Branch (normalerweise `main`)
   - Klicke "Run workflow"

---

## 💻 Methode 2: Manuelles Deployment (Vercel CLI)

### Installation & Setup

```bash
# 1. Vercel CLI global installieren
npm i -g vercel

# 2. Bei Vercel anmelden
vercel login
# → Wähle "Google" und nutze yoni@pihoch2.me
```

### Projekt verknüpfen (einmalig)

```bash
# Im YONI-app Repository-Ordner
cd /path/to/YONI-app

# Projekt mit Vercel verbinden
vercel link
```

Du wirst gefragt:
- **Set up and deploy?** → Ja
- **Which scope?** → Wähle deine Organization (pihoch2)
- **Link to existing project?** → Ja (wenn bereits erstellt) oder Nein (für neu)
- **Project name?** → `yoni-app` (oder wie gewünscht)

Dies erstellt eine `.vercel` Konfiguration (wird in `.gitignore` ignoriert).

### Production Deployment

```bash
# Production Deployment ausführen
vercel --prod
```

**Was passiert:**
1. Code wird gebaut (`npm run build`)
2. Build-Artefakte werden zu Vercel hochgeladen
3. Deployment wird auf Production-Domain veröffentlicht
4. Du erhältst eine Deployment-URL

**Typische Ausgabe:**
```
🔍  Inspect: https://vercel.com/pihoch2/yoni-app/xxxxxx
✅  Production: https://yoni-app.vercel.app [1s]
```

### Preview Deployment (für Tests)

```bash
# Preview Deployment (nicht Production)
vercel

# Mit spezifischem Build Command
vercel --build-env NODE_ENV=development
```

Preview Deployments erhalten eine einzigartige URL wie:
`https://yoni-app-git-branch-name-pihoch2.vercel.app`

---

## 🌐 Domain-Konfiguration

### Standard Vercel Domain

Nach dem Deployment ist die App automatisch verfügbar unter:
- `https://yoni-app.vercel.app` (automatisch generiert)
- `https://yoni-app-pihoch2.vercel.app` (mit Organization-Name)

### Custom Domain hinzufügen

#### 1. Vercel-Subdomain registrieren

```bash
vercel domains add yoni-app-pihoch2.vercel.app
```

#### 2. Eigene Domain konfigurieren (yoni.pihoch2.me)

**Schritt 1: Domain zu Vercel hinzufügen**

```bash
vercel domains add yoni.pihoch2.me
```

**Schritt 2: DNS konfigurieren**

Vercel gibt dir die benötigten DNS-Records. Gehe zu deinem DNS-Provider (z.B. Cloudflare, namecheap, etc.) und füge hinzu:

```
Type: CNAME
Name: yoni
Value: cname.vercel-dns.com
```

**Schritt 3: Warten auf DNS-Propagation**

- DNS-Änderungen können bis zu 48 Stunden dauern
- Typischerweise: 5-30 Minuten
- Überprüfen: `nslookup yoni.pihoch2.me`

**Schritt 4: SSL-Zertifikat**

Vercel generiert automatisch ein kostenloses SSL-Zertifikat via Let's Encrypt.

#### Alternative: Domain via Vercel Dashboard

1. Gehe zu [vercel.com/dashboard](https://vercel.com/dashboard)
2. Wähle dein Projekt
3. Settings → Domains
4. Klicke "Add Domain"
5. Gib `yoni.pihoch2.me` ein
6. Folge den DNS-Anweisungen

---

## 🔒 Umgebungsvariablen

### Lokale Entwicklung

Erstelle `.env.local` (wird in `.gitignore` ignoriert):

```bash
# .env.local
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Vercel Production

**Via CLI:**

```bash
vercel env add OPENAI_API_KEY production
# Füge den Wert ein wenn gefragt

vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
```

**Via Dashboard:**

1. Gehe zu Vercel Projekt → Settings → Environment Variables
2. Klicke "Add New"
3. Gib Key & Value ein
4. Wähle Environment: Production / Preview / Development
5. Speichern

**Wichtig:** Nach dem Hinzufügen von Env-Variablen **neu deployen**!

```bash
vercel --prod --force
```

---

## 📊 Deployment überwachen

### Vercel Dashboard

- **URL:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Funktionen:**
  - Deployment-Status sehen
  - Logs einsehen
  - Performance-Metriken
  - Rollback zu vorherigen Deployments

### Vercel CLI

```bash
# Liste alle Deployments
vercel ls

# Logs eines Deployments ansehen
vercel logs <deployment-url>

# Deployment-Informationen
vercel inspect <deployment-url>
```

### GitHub Actions

- Gehe zu GitHub → Actions
- Wähle "Deploy YONI-app to Vercel" Workflow
- Sieh Logs und Status jedes Deployments

---

## 🐛 Troubleshooting

### Build schlägt fehl

**Problem:** `npm run build` schlägt während Deployment fehl

**Lösung:**
```bash
# Lokal testen
npm install
npm run build

# Bei Erfolg lokal aber Fehler auf Vercel:
# Überprüfe Node.js Version
vercel env ls
# Stelle sicher Node ≥ 18.17.0
```

### Domain funktioniert nicht

**Problem:** Custom Domain zeigt nicht auf die App

**Lösung:**
1. Überprüfe DNS-Records: `nslookup yoni.pihoch2.me`
2. Warte 5-30 Minuten für DNS-Propagation
3. Überprüfe Vercel Dashboard → Domains für Status
4. Stelle sicher CNAME zeigt auf `cname.vercel-dns.com`

### Umgebungsvariablen fehlen

**Problem:** App funktioniert nicht wegen fehlenden API-Keys

**Lösung:**
```bash
# Überprüfe Env-Variablen
vercel env ls

# Füge fehlende hinzu
vercel env add NAME_DER_VARIABLE production

# Redeploy
vercel --prod --force
```

### 404 Fehler auf API Routes

**Problem:** `/api/chat` oder andere API-Routes geben 404

**Lösung:**
- Überprüfe `vercel.json` Konfiguration
- Stelle sicher API-Routes in `app/api/` existieren
- Checke Vercel Logs für Fehler
- Redeploy mit `vercel --prod --force`

---

## ⚡ Best Practices

### Vor jedem Deployment

```bash
# 1. Code prüfen
npm run lint

# 2. Lokal bauen
npm run build

# 3. Lokal testen
npm run dev
# → http://localhost:3000 testen

# 4. Wenn alles funktioniert
git add .
git commit -m "Beschreibung der Änderungen"
git push origin main
```

### Preview Deployments nutzen

- Erstelle einen Feature-Branch
- Pushe zu GitHub
- Öffne einen Pull Request
- Vercel erstellt automatisch Preview Deployment
- Teile Preview-URL mit Team für Review
- Nach Approval: Merge zu `main`

### Rollback bei Problemen

**Via Dashboard:**
1. Gehe zu Vercel Dashboard
2. Wähle Projekt
3. Deployments → Finde funktionierendes Deployment
4. Klicke "..." → "Promote to Production"

**Via CLI:**
```bash
vercel rollback
```

---

## 📝 Checkliste für Production Launch

- [ ] Alle Tests laufen erfolgreich (`npm run lint && npm run build`)
- [ ] Umgebungsvariablen sind in Vercel konfiguriert
- [ ] Custom Domain DNS ist konfiguriert
- [ ] SSL-Zertifikat ist aktiv (automatisch via Vercel)
- [ ] GitHub Actions Secrets sind gesetzt
- [ ] Monitoring ist aktiviert (Vercel Analytics)
- [ ] Error Tracking ist konfiguriert (optional: Sentry)
- [ ] Backup-Strategie dokumentiert
- [ ] Team hat Zugriff auf Vercel Projekt

---

## 🔗 Nützliche Links

- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Vercel Dokumentation:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel CLI Referenz:** [vercel.com/docs/cli](https://vercel.com/docs/cli)
- **GitHub Actions Workflow:** `.github/workflows/deploy-yoni-app.yml`

---

## 🆘 Support

Bei Problemen oder Fragen:

1. Überprüfe diese Dokumentation
2. Sieh Vercel Logs im Dashboard
3. Checke GitHub Issues
4. Kontaktiere [@pappensex](https://github.com/pappensex)
5. Email: [yoni@pihoch2.me](mailto:yoni@pihoch2.me)

---

## 📜 Änderungshistorie

| Datum | Version | Änderungen |
|-------|---------|------------|
| 2025-11-13 | 1.0 | Initiale Dokumentation erstellt |

---

> _„Im Dunkel des Alls glitzert jeder Mensch als eigene Galaxie."_ ✨
