# YONI Local Run Guide (Testmodus)

## YONI App mit ChatGPT Integration

### Setup

```bash
cd /path/to/YONI-app
npm install
```

### Konfiguration

1. Erstelle eine `.env` Datei im Root-Verzeichnis
2. Füge deinen OpenAI API Key hinzu:

```
OPENAI_API_KEY=sk-...
```

3. Hol dir einen API Key von: https://platform.openai.com/api-keys

### Starten

```bash
npm run dev
```

Die App ist dann verfügbar unter: http://localhost:3000

### ChatGPT Features

- **Consensus Mode**: Konsensorientierte, ausgewogene Antworten
- **Contrast Mode**: Visionäre Perspektiven mit Gegensätzen
- **Chain Mode**: Systematische, schrittweise Antworten

Routes: `/app/api/chat` (POST)

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
