# 🚀 Launch Sprint — 72h "Proof of Cash"

Dieses Repository enthält die Notion-Template-Struktur und Beispiel-Tasks für einen 72-Stunden-Go-to-Market-Sprint.

---

## 📂 Dateien
| Datei | Beschreibung |
|--------|---------------|
| [`notion-template.json`](./notion-template.json) | Importierbare Notion-Datenbank mit allen Properties, Views und Beispiel-Tasks |
| [`launch_tasks.csv`](./launch_tasks.csv) | Alternativer CSV-Import, falls JSON-Import deaktiviert ist |
| [`README.md`](./README.md) | Diese Anleitung |

---

## 🧭 Import in Notion
1. Öffne Notion → **Import → JSON**  
2. Wähle `notion-template.json`  
3. Notion erstellt automatisch eine Datenbank mit:
   - Properties: Status, Priority, Pillar, Due Date, Owner, Notes, Progress  
   - 10 vordefinierte Launch-Tasks  
4. Optional: Importiere `launch_tasks.csv`, falls du lieber eine flache Tabelle willst.  

---

## ⚙️ Automatisches Progress-Tracking aktivieren

Notion kann den Fortschritt automatisch berechnen, wenn du Relationen und Rollups einsetzt.

### Variante A – Schnellformel (ohne Subtasks)
Füge in deiner Datenbank eine **Formula-Property** hinzu:

**Name:** `Auto Progress`  
**Formel:**
```notion
if(prop("Status") == "🟢 Done", 100, if(prop("Status") == "🟡 In Progress", 50, 0))
```

Diese Formel setzt automatisch:
- **100%** wenn Status = Done
- **50%** wenn Status = In Progress
- **0%** sonst

---

### Variante B – Manuelle Subtasks mit Rollup
Für komplexere Projekte mit Subtasks:

1. Erstelle eine zweite Datenbank: **"Subtasks"**
2. Füge eine **Relation** zwischen Main Tasks ↔ Subtasks hinzu
3. In der Subtask-DB: Checkbox-Property `✅ Completed`
4. In der Main-Task-DB: **Rollup** über Relation:
   - **Calculate:** `Percent checked`
   - **Relation:** → Subtasks
   - **Property:** → Completed

Notion berechnet dann automatisch den %-Wert basierend auf erledigten Subtasks.

---

## 📊 Empfohlene Views

### 1. 📅 Timeline View
- **Group by:** Pillar (💰 Revenue, 📣 Marketing, etc.)
- **Sort by:** Due Date (ascending)
- **Filter:** Status ≠ Done

Zeigt alle offenen Tasks auf einer Zeitachse, gruppiert nach Säule.

---

### 2. 🎯 High Priority Board
- **Layout:** Board
- **Group by:** Status
- **Filter:** Priority = 🔥 Critical OR ⚡ High
- **Sort by:** Due Date

Kanban-Board nur mit kritischen Tasks.

---

### 3. 💡 Progress Dashboard
- **Layout:** Table
- **Visible Properties:** Name, Status, Priority, Progress, Due Date
- **Sort by:** Progress (descending)
- **Filter:** None (zeigt alles)

Überblick über den Gesamtfortschritt.

---

## 🔄 Workflow-Empfehlung

### Tag 1 (0–24h): Foundation
**Ziel:** Payment + Landing Page + Community Setup

- [ ] Stripe Integration testen
- [ ] Landing Page deployen
- [ ] Community Guidelines veröffentlichen
- [ ] Beta-Tester:innen kontaktieren (erste 10)

---

### Tag 2 (24–48h): Growth Setup
**Ziel:** Marketing Assets + Monitoring + Onboarding

- [ ] Product Hunt Listing vorbereiten
- [ ] Social Media Assets erstellen
- [ ] Analytics Setup (Sentry + Vercel)
- [ ] Onboarding Flow testen
- [ ] Beta-Tester:innen Follow-up (weitere 20)

---

### Tag 3 (48–72h): Launch & Conversion
**Ziel:** 10 zahlende Kund:innen + Launch Execution

- [ ] 08:00 Uhr: Product Hunt Launch
- [ ] 10:00 Uhr: Twitter Thread
- [ ] 12:00 Uhr: LinkedIn Post
- [ ] 14:00 Uhr: Reddit AMA
- [ ] Persönliche Outreach-Kampagne für Early-Bird Discount
- [ ] Testimonials von ersten Nutzern sammeln

---

## 🎯 Erfolgsmetriken

| Metrik | Ziel (72h) | Tracking |
|--------|------------|----------|
| **Signups** | 100 | Vercel Analytics |
| **Beta-Tester** | 30 | Notion People Property |
| **Paying Customers** | 10 | Stripe Dashboard |
| **Product Hunt Upvotes** | 50+ | PH Analytics |
| **MRR** | €100 | Stripe Recurring Revenue |

---

## 🛠️ Technische Integration

Falls du die Notion API verwenden willst, um Fortschritt zu tracken:

### Setup
```bash
npm install @notionhq/client
```

### Beispiel: Task als "Done" markieren
```javascript
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function markTaskDone(pageId) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Status: { select: { name: "🟢 Done" } },
      Progress: { number: 100 },
    },
  });
}
```

---

## 📋 Launch-Checkliste (Quick Reference)

### Pre-Launch (Tag 1)
- [ ] Stripe Payment Setup
- [ ] Landing Page live
- [ ] Community Guidelines veröffentlicht
- [ ] Beta-Tester:innen Outreach gestartet (30 Personen)

### Marketing (Tag 2)
- [ ] Product Hunt Listing vorbereitet
- [ ] Social Media Assets erstellt (Twitter, LinkedIn, Instagram)
- [ ] Analytics & Monitoring aktiviert
- [ ] Onboarding Flow finalisiert

### Launch Day (Tag 3)
- [ ] Product Hunt Launch (08:00)
- [ ] Twitter Thread (10:00)
- [ ] LinkedIn Post (12:00)
- [ ] Reddit AMA (14:00)
- [ ] Early-Bird Kampagne gestartet
- [ ] Erste 10 zahlende Kund:innen gewonnen

---

## 💡 Tipps für maximale Effizienz

1. **Timeboxing:** Jede Task maximal 2–4h. Bei Blockern → eskalieren oder skippen.
2. **Daily Standups:** 15min Check-in um 09:00, 15:00, 21:00 Uhr.
3. **Async Communication:** Notion Comments nutzen statt Meetings.
4. **Ship Fast:** Lieber 80% fertig und live als 100% perfekt und unsichtbar.
5. **Celebrate Wins:** Jeden Meilenstein (10 Signups, 1st Payment) im Team teilen.

---

## 🚨 Häufige Probleme

### Problem: Notion JSON-Import schlägt fehl
**Lösung:**  
- Datei in Browser öffnen → auf Syntax-Fehler prüfen
- Alternativ: CSV-Import nutzen (`launch_tasks.csv`)

### Problem: Properties werden nicht importiert
**Lösung:**  
- Import als "Database" (nicht "Page")
- Nach Import manuell Views erstellen (Timeline, Board)

### Problem: Rollup zeigt falsche Werte
**Lösung:**  
- Relation zwischen Main Tasks ↔ Subtasks prüfen
- Rollup-Konfiguration: `Calculate = Percent checked`

---

## 🔗 Nützliche Links

- [Notion API Docs](https://developers.notion.com/)
- [Stripe Quick Start](https://stripe.com/docs/payments/quickstart)
- [Product Hunt Launch Guide](https://www.producthunt.com/launch)
- [YONI App Repo](https://github.com/pappensex/YONI-app)

---

## 📧 Support

Bei Fragen zum Template oder Launch-Sprint:  
**Mail:** [yoni@pihoch2.me](mailto:yoni@pihoch2.me)  
**GitHub Issues:** [YONI-app/issues](https://github.com/pappensex/YONI-app/issues)

---

> _"72 Stunden. 10 Kund:innen. Unendlich viel Glitzer. 🟣✨"_
