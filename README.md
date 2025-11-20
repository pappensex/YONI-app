# ✨ YONI – Überhochglitzer App

> 🟣 Ein sicherer, liebevoller Raum für mentale Gesundheit – digital, fachärztlich begleitet und technisch perfekt.

![YONI Banner](https://user-images.githubusercontent.com/placeholder/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)
[![Accessibility](https://img.shields.io/badge/A11y-AA%2B-2ECC71)](#)

---

## 🌌 Mission

**YONI** ist eine Online-Selbsthilfegruppe für psychisch belastete Menschen  
mit **fachärztlicher Begleitung, digitaler Sicherheit und liebevoller Gestaltung**.

**🔞 Altersfreigabe: 18+** – YONI richtet sich an erwachsene Nutzer:innen.

Die App vereint:
- 🤝 **Gemeinschaft** – Chat-Räume & Themenkreise mit Peer-Mentor:innen  
- 🧠 **Fachliche Supervision** – Ärzt:innen, Therapeut:innen, geschützte Q&A  
- 🪞 **Selbstwirksamkeit** – Tools für Reflexion, Stimmung & Achtsamkeit  
- 🌈 **Überhochglitzer-Design** – kosmisch, heilend, barrierefrei, technisch präzise  
- ✨ **GODDESSMODE+** – Erweiterte visuelle Effekte für ein intensiveres Erlebnis  

---

## ⚙️ Tech Stack

| Layer | Technologie | Beschreibung |
|-------|--------------|---------------|
| Frontend | **Next.js 14** | App Router, SSR, optimierte Performance |
| Styling | **TailwindCSS + Überhochglitzer Theme** | Tokens, Animation, Starfield |
| Backend | **API Routes (Edge Functions)** | Stripe, GitHub Webhooks, Chat |
| Deployment | **Vercel** | Preview + Production CI/CD |
| Monitoring | **Lighthouse CI, axe-core** | A11y, Performance, QA Checks |

---

## 🧩 Design Tokens & Theme

| Token | Wert | Bedeutung |
|-------|------|-----------|
| `brand.amethyst` | `#9966CC` | Hoffnung, Spiritualität, Transformation |
| `text.starwhite` | `#F5F5F5` | Klarheit und Licht im Dunkeln |
| `ok.emerald` | `#2ECC71` | Heilung und Wachstum |
| `hl.gold` | `#FFD700` | Wärme, Wert und Verbundenheit |

---

## 🚀 Getting Started

### Lokale Entwicklung

Schnellstart mit Setup-Skript:

```bash
git clone https://github.com/pappensex/YONI-app.git
cd YONI-app
npm run setup:local
npm run dev
```

Die App ist dann verfügbar unter: **http://localhost:3000**

Alternativ manuell:

```bash
npm install
npm run dev
```

Siehe [YONI_Local_Run_Guide.md](YONI_Local_Run_Guide.md) für Details.

### iPhone-Demo / Testversand
- 📱 **Homescreen-Installation:** Safari → Teilen → „Zum Home-Bildschirm".
- 📤 **Preview verschicken:** Anleitung siehe [IOS_DEMO_GUIDE.md](IOS_DEMO_GUIDE.md).

### Deployment

Siehe **[DEPLOYMENT.md](DEPLOYMENT.md)** für vollständige Deployment-Anleitung:
- 🤖 Automatisches Deployment via GitHub Actions
- 💻 Manuelles Deployment via Vercel CLI
- 🌐 Domain-Konfiguration (pihoch2.me, www, app, api)
- 🔒 Umgebungsvariablen

**Quick Domain Setup:**
```bash
# Domain-Setup-Script ausführen
npm run domains:setup:dry-run  # Vorschau
npm run domains:setup          # Domains hinzufügen
```

---

## 💜 Contributing

1. Fork das Repo  
2. Erstelle einen Feature-Branch: `git checkout -b feature/dein-thema`  
3. Führe `npm run lint && npm run build` aus  
4. Erstelle einen Pull-Request ✨  

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

### CI Checks
- ✅ ESLint + TypeScript  
- ✅ A11y (axe)  
- ✅ Lighthouse ≥ 95  
- ✅ Duplicate Route Guard  

---

## 🧘‍♀️ Lizenz & Verantwortung

Dieses Projekt ist **Open Source (MIT)**.  
Es ersetzt **keine Therapie**.  
YONI versteht sich als digitaler Begleiter auf dem Weg zur Heilung,  
nicht als medizinisches Produkt.

---

## 🔮 Kontakt & Links

**Projektleitung:** [@pappensex](https://github.com/pappensex)  
**Website:** [yoni.pihoch2.me](https://yoni.pihoch2.me)  
**Demo:** [yoni.vercel.app](https://yoni.vercel.app)  
**Mail:** [yoni@pihoch2.me](mailto:yoni@pihoch2.me)

---

> _„Im Dunkel des Alls glitzert jeder Mensch als eigene Galaxie."_
