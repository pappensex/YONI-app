# Contributing Guide – YONI App

Danke, dass du YONI unterstützen möchtest 💜  
Dieses Dokument erklärt kurz, wie du beitragen kannst.

---

## 💻 Entwicklungsumgebung

```bash
git clone https://github.com/pappensex/YONI-app.git
cd YONI-app
npm install
npm run dev
```

---

## 🔄 Workflow

1. **Fork das Repository**  
   Erstelle deinen eigenen Fork des YONI-App Repositories.

2. **Erstelle einen Feature-Branch**  
   ```bash
   git checkout -b feature/dein-thema
   ```

3. **Mache deine Änderungen**  
   - Halte dich an den bestehenden Code-Stil
   - Schreibe klare, aussagekräftige Commit-Messages
   - Teste deine Änderungen lokal

4. **Quality Checks**  
   Führe vor dem Commit folgende Checks aus:
   ```bash
   npm run lint
   npm run build
   ```

5. **Erstelle einen Pull-Request**  
   - Beschreibe deine Änderungen klar und deutlich
   - Verlinke relevante Issues
   - Warte auf Code-Review ✨

---

## ✅ CI Checks

Alle Pull-Requests durchlaufen automatische Quality Checks:

- ✅ **ESLint + TypeScript** – Code-Qualität und Typsicherheit
- ✅ **A11y (axe)** – Barrierefreiheit
- ✅ **Lighthouse ≥ 95** – Performance, Best Practices, SEO
- ✅ **Duplicate Route Guard** – Vermeidung von Routing-Konflikten

---

## 🎨 Design-Prinzipien

YONI folgt dem **Überhochglitzer-Design**:

- 🌌 **Kosmisch & heilend** – Visuell beruhigend und inspirierend
- ♿ **Barrierefrei** – WCAG AA+ Standard
- 🎯 **Präzise & performant** – Optimierte User Experience
- 💜 **Liebevoll gestaltet** – Mit Sorgfalt für die Community

### Design Tokens

| Token | Wert | Bedeutung |
|-------|------|-----------|
| `brand.amethyst` | `#9966CC` | Hoffnung, Spiritualität, Transformation |
| `text.starwhite` | `#F5F5F5` | Klarheit und Licht im Dunkeln |
| `ok.emerald` | `#2ECC71` | Heilung und Wachstum |
| `hl.gold` | `#FFD700` | Wärme, Wert und Verbundenheit |

---

## 📝 Code-Richtlinien

- Verwende **TypeScript** für neue Dateien
- Folge dem **ESLint** Standard des Projekts
- Schreibe **semantisches HTML** mit ARIA-Labels wo nötig
- Optimiere für **Performance** (Core Web Vitals)
- Kommentiere komplexe Logik auf Deutsch oder Englisch

---

## 🧪 Testing

- Teste deine Änderungen in verschiedenen Browsern
- Prüfe die Barrierefreiheit mit Screen-Readern
- Stelle sicher, dass alle CI-Checks bestehen

---

## 🤝 Community-Richtlinien

- Sei respektvoll und empathisch
- YONI ist ein **sicherer Raum** – bewahre diese Atmosphäre
- Konstruktives Feedback ist willkommen
- Bei Fragen: Eröffne ein Issue oder kontaktiere [@pappensex](https://github.com/pappensex)

---

## 📧 Kontakt

- **Projektleitung:** [@pappensex](https://github.com/pappensex)
- **Mail:** [yoni@pihoch2.me](mailto:yoni@pihoch2.me)
- **Website:** [yoni.pihoch2.me](https://yoni.pihoch2.me)

---

## 🙏 Vielen Dank!

Jeder Beitrag – ob Code, Design, Dokumentation oder Feedback – hilft YONI zu wachsen und mehr Menschen zu erreichen.

> _„Im Dunkel des Alls glitzert jeder Mensch als eigene Galaxie."_ ✨
