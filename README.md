# ✨ YONI – Überhochglitzer App

> 🟣 Ein sicherer, liebevoller Raum für mentale Gesundheit – digital, fachärztlich begleitet und technisch perfekt.

![YONI Banner](https://user-images.githubusercontent.com/placeholder/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1%20AA+-2ECC71)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTORS.md)

---

## 🌌 Mission

**YONI** ist eine Online-Selbsthilfegruppe für psychisch belastete Menschen  
mit **fachärztlicher Begleitung, digitaler Sicherheit und liebevoller Gestaltung**.

Die App vereint:
- 🤝 **Gemeinschaft** – Chat-Räume & Themenkreise mit Peer-Mentor:innen  
- 🧠 **Fachliche Supervision** – Ärzt:innen, Therapeut:innen, geschützte Q&A  
- 🪞 **Selbstwirksamkeit** – Tools für Reflexion, Stimmung & Achtsamkeit  
- 🌈 **Überhochglitzer-Design** – kosmisch, heilend, barrierefrei, technisch präzise  

### Current Development Phase

**Status:** Early Development  
**Current:** HTML/JavaScript Prototype  
**Target:** Next.js 14 Production Application

This repository contains the foundation and comprehensive documentation for building the full YONI platform. The configuration files and documentation reflect the target architecture (Next.js 14, TailwindCSS, Vercel) that we're working towards.

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

## 📦 Quick Start

```bash
# Clone the repository
git clone https://github.com/pappensex/YONI-app.git
cd YONI-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action.

---

## 📖 Full Documentation

For comprehensive documentation including:
- Complete setup instructions
- Architecture overview
- Design system and theming
- Security and privacy guidelines
- Contributing guidelines
- Deployment procedures

**See:** [`.github/instructions/*.instructions.md`](.github/instructions/*.instructions.md)

---

## 💜 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create a branch:** `git checkout -b feature/your-feature`
3. **Make changes** and test thoroughly
4. **Run checks:** `npm run lint && npm run type-check && npm run test`
5. **Commit:** Use [Conventional Commits](https://www.conventionalcommits.org/)
6. **Push** and create a **Pull Request**

### CI Checks
- ✅ ESLint + TypeScript (strict mode)
- ✅ Unit & E2E Tests
- ✅ Accessibility (axe-core)
- ✅ Lighthouse Score ≥ 95
- ✅ Security Checks

**Full contributing guide:** See [instructions](.github/instructions/*.instructions.md#8-beitragen-contributing)

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
