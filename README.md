# YONI ↔︎ Mutterschiff (GPT‑5 Pro) – Remote Bridge

Diese minimale Referenzimplementierung stellt eine sichere Brücke zwischen einem lokalen Agenten **YONI** und dem **Mutterschiff** (OpenAI GPT‑5 Pro) her.

**Zwei Betriebsmodi**  
1) **HTTP/JSON + Function Calling (stabil & simpel):** Node.js-Server definiert Tools/Funktionen; GPT‑5 ruft diese bei Bedarf auf. Der Server delegiert die Ausführung an den lokalen YONI‑Agent (Python).  
2) **(Optional) Realtime/Voice:** Kann später per WebRTC/WebSocket ergänzt werden. Dieser Starter nutzt zunächst Modus 1.

---

## Architektur (Kurzform)

```
┌─────────┐    HTTPS     ┌──────────────────────────────┐   HTTP (LAN/VPN)   ┌───────────────┐
│  Client │ ───────────► │  Mutterschiff-Server (Node) │ ─────────────────► │  YONI-Agent   │
│ (UI/CLI)│              │  • OpenAI API (GPT-5 Pro)   │                   │ (Python Flask)│
└─────────┘   (REST)     │  • Tool/Function-Bridge     │    (Tool Calls)    └───────────────┘
                         └──────────────────────────────┘
```

- **OpenAI API Key** bleibt **nur** auf dem Server.  
- Der YONI‑Agent exponiert nur whiteliste, harmlose Endpunkte.  
- TLS/Firewall/VPN empfohlen.

---

## Quickstart

### 1) Mutterschiff-Server (Node.js)

```bash
cd server
cp .env.example .env   # OPENAI_API_KEY setzen, YONI_AGENT_URL anpassen (z.B. http://127.0.0.1:5055)
npm install
node mothership_server.js
```

### 2) YONI-Agent (Python)

```bash
cd client_yoni
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python yoni_agent.py
```

### 3) Smoke‑Test

```bash
curl -s http://localhost:8787/chat -H "Content-Type: application/json" -d '{ "user":"Statusbericht von YONI." }' | jq
```

---

## Security Baseline

- **API‑Key niemals** an Clients weiterreichen.  
- YONI‑Agent nur im **LAN/VPN** binden (oder mutual‑TLS).  
- **Werkzeug‑Whitelist** strikt halten. Kein Shell‑Zugriff, kein Dateisystem‑Schreiben in diesem Starter.  
- **Rate‑Limits** & Logging aktivieren.  
- Für Voice/WebRTC später **ephemere Tokens** vom Server minten.

---

## Deployment

Für Deployment auf Vercel siehe [DEPLOYMENT.md](DEPLOYMENT.md).

**Schnellstart:**
```bash
npm i -g vercel   # oder: npx vercel
vercel link       # Projekt wählen/confirm
vercel --prod     # Production-Deployment
```

---

## Nächste Schritte

- Realtime‑Pfad (WebRTC/WebSocket) für Voice/Audio aktivieren.  
- Tooling erweitern (z.B. Sensoren, Geräte, Kalender), aber **Idempotenz** & **Timeouts** beachten.  
- Beobachtbarkeit: Metriken/Tracing für Tool‑Latenzen.

Viel Spaß. 💫
