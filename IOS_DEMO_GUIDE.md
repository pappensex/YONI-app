# 📱 iPhone Demo & Testversand

Dieser Guide beschreibt, wie du die YONI Web-App schnell auf einem iPhone als "App" installierst und eine verschickbare Testversion vorbereitest (Demo-Lauf).

## 1) Was du brauchst

- Apple iPhone mit aktueller iOS-Version und Safari.
- Zugriff auf einen laufenden Build (z. B. `yoni.vercel.app` oder eine Vercel Preview-URL).
- Optional: eigene `.env.local` mit `OPENAI_API_KEY` für ChatGPT-Features (siehe **YONI_Local_Run_Guide.md**).

## 2) Demo auf dem iPhone installieren (PWA)

1. Öffne die gewünschte URL in **Safari** (z. B. https://yoni.vercel.app oder deine Preview).
2. Tippe auf das **Teilen**-Symbol.
3. Wähle **Zum Home-Bildschirm**.
4. Bestätige den Namen und tippe auf **Hinzufügen**.
5. Starte die App vom Homescreen – sie läuft dann im Fullscreen wie eine native App.

> Tipp: Wenn der Prompt erscheint, Notifications erlauben, damit Reminder und Chat-Alerts kommen.

## 3) Testversion versandfertig machen (Preview)

1. **Lokalen Check bauen**
   - `npm ci`
   - `npm run build`
2. **Preview auf Vercel deployen**
   - Falls noch nicht verlinkt: `npx vercel link` und Projekt auswählen.
   - `npx vercel --prebuilt --env=preview` oder `npx vercel --prod` für eine stabile Demo.
   - Notwendige Secrets/Env-Variablen auf Vercel hinterlegen (z. B. `OPENAI_API_KEY`).
3. **Preview-Link testen**
   - Link auf dem iPhone öffnen und per Schritt 2 als App hinzufügen.
   - Kernflows prüfen: Startseite, Chat, Navigation, Laden im Vollbild.
4. **An Tester:innen senden**
   - Kurze Anleitung mitsenden: Safari öffnen → Link → Teilen → „Zum Home-Bildschirm“.
   - Bei Bedarf Hinweis auf Demo-Daten (keine echten Nutzer:innendaten verwenden).

## 4) Quick-Checks vor dem Versand

- ✅ Lädt ohne Next.js Errors (404/500) und ohne leere Komponenten.
- ✅ Responsive: Startseite, Navigation und Chat auf iPhone 12/13/14 getestet.
- ✅ Zugriff auf Kamera/Mikrofon NICHT benötigt (keine Prompts auftauchen).
- ✅ Kein Tracking/Analytics ohne Zustimmung.

## 5) FAQ

- **Warum PWA und nicht TestFlight?** Die App ist eine Next.js Web-App; PWA-Installation ist der schnellste Weg zum Homescreen ohne iOS-Build.
- **Funktioniert das auch mit Chrome?** Auf iOS geht die Homescreen-Installation zuverlässig nur mit Safari.
