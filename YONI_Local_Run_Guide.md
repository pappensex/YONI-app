# YONI Local Run Guide (Testmodus)

## Vercel Environment Setup

Bevor Sie die Anwendung lokal ausführen, ziehen Sie die Umgebungsvariablen von Vercel:

```bash
vercel env pull .env.local   # erzeugt/aktualisiert .env.local
```

Dies erstellt oder aktualisiert die `.env.local`-Datei mit allen in Vercel konfigurierten Umgebungsvariablen.

**Voraussetzungen:**
- Vercel CLI installiert: `npm i -g vercel`
- Angemeldet bei Vercel: `vercel login`
- Verknüpft mit dem Projekt: `vercel link`

---

## chi-bot-starter
```bash
cd chi-bot-starter
npm install
npm run dev
```
ENV (example):
```
OPENAI_API_KEY=sk-...
```
Routes: `/app/api/chat`

## pihoch2-dashboard-nextjs
```bash
cd pihoch2-dashboard-nextjs
npm install
npm run dev
```

## Static site (Prolula_Website_Starter)
Open `index.html` directly in a browser.

## Codespaces quickstart
1. New Codespace on repo.
2. Terminal:
```bash
npm ci
npm run dev -- -p 3000
```
3. Expose port 3000 -> public.
