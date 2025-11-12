# 🚀 YONI Launch Operations

> Zentrale Task-Management-Struktur für den YONI App Launch

## 📋 Übersicht

Dieses Verzeichnis enthält die strukturierte Task-Verwaltung für den YONI-Launch, organisiert nach drei strategischen Säulen:

| Pillar | Fokus | Beispiel |
|---------|--------|-----------|
| **BUILD** | Technisches Fundament | Stripe Webhook fixen, Deploy testen |
| **PAYMENT** | Monetarisierung & Compliance | Instant Payment aktivieren, Checkout-Link einrichten |
| **YOUTUBE** | Reichweite & Conversion | Short drehen, Community-Post mit Stripe-Link |

## 📁 Dateistruktur

```
project-ops/launch/
├── notion-template.json   # Strukturierte Task-Daten (JSON)
├── launch_tasks.csv      # Flache Task-Liste (CSV)
└── README.md            # Diese Dokumentation
```

## 🪄 Quickstart (lokal)

Wenn du das Repo klonst, kannst du die JSON und CSV lokal prüfen:

```bash
git clone https://github.com/pappensex/YONI-app.git
cd YONI-app/project-ops/launch
cat notion-template.json | jq '.title'
```

### Beispiel-Abfragen

```bash
# Titel anzeigen
jq '.title' notion-template.json

# Alle Pillars auflisten
jq '.pillars[].name' notion-template.json

# BUILD-Tasks anzeigen
jq '.pillars[] | select(.name == "BUILD") | .tasks' notion-template.json

# High-Priority Tasks finden
jq '.pillars[].tasks[] | select(.priority == "high")' notion-template.json

# Status-Übersicht
jq '.pillars[].tasks[] | {id, title, status}' notion-template.json

# Anzahl Tasks pro Pillar
jq '.pillars[] | {name, count: (.tasks | length)}' notion-template.json
```

## 📊 CSV-Nutzung

Die `launch_tasks.csv` kann mit Standard-Tools analysiert werden:

```bash
# Alle Tasks anzeigen
cat launch_tasks.csv

# BUILD-Tasks filtern
grep "^BUILD" launch_tasks.csv

# High-Priority Tasks
grep ",high," launch_tasks.csv

# Task-Zählung pro Pillar
cut -d, -f1 launch_tasks.csv | tail -n +2 | sort | uniq -c
```

## 🎯 Task-Format

### JSON-Struktur

Jeder Task hat folgende Felder:

```json
{
  "id": "PILLAR-NNN",
  "title": "Task Titel",
  "description": "Detaillierte Beschreibung",
  "status": "pending|in_progress|review|completed|blocked",
  "priority": "low|medium|high|critical",
  "example": "Konkretes Beispiel",
  "tags": ["tag1", "tag2"]
}
```

### CSV-Format

```csv
Pillar,Task ID,Title,Description,Status,Priority,Tags,Example,Due Date
BUILD,BUILD-001,Stripe Webhook fixen,Fix webhook integration,in_progress,high,"stripe,backend",Stripe Webhook fixen,2025-11-15
```

## 🔄 Workflow

### Task-Status

| Status | Bedeutung |
|--------|-----------|
| `pending` | Noch nicht begonnen |
| `in_progress` | In Bearbeitung |
| `review` | In Review/Testing |
| `completed` | Abgeschlossen |
| `blocked` | Blockiert (Abhängigkeiten) |

### Prioritäten

| Priority | Beschreibung |
|----------|--------------|
| `critical` | Sofort erledigen, blocker für Launch |
| `high` | Wichtig für MVP |
| `medium` | Wünschenswert |
| `low` | Nice-to-have |

## 🛠️ Integration

### Mit GitHub Issues

Tasks können mit GitHub Issues verknüpft werden:

```bash
# Issue für Task erstellen
gh issue create --title "BUILD-001: Stripe Webhook fixen" \
  --label "build,high-priority" \
  --body "$(jq -r '.pillars[0].tasks[0].description' notion-template.json)"
```

### Mit Notion

Die `notion-template.json` kann in Notion importiert werden:

1. Notion-Datenbank erstellen
2. JSON-Import-Feature nutzen
3. Felder mappen: id → ID, title → Name, etc.

### Mit Jira/Trello

CSV kann direkt in Jira/Trello importiert werden:

1. Projekt/Board öffnen
2. Import → CSV wählen
3. `launch_tasks.csv` hochladen
4. Feldmapping durchführen

## 📈 Monitoring

### Progress Tracking

```bash
# Fertigstellungsgrad berechnen
echo "scale=2; $(jq '[.pillars[].tasks[]] | map(select(.status == "completed")) | length' notion-template.json) / $(jq '[.pillars[].tasks[]] | length' notion-template.json) * 100" | bc
```

### Pillar-Status

```bash
# Status pro Pillar
for pillar in BUILD PAYMENT YOUTUBE; do
  echo "=== $pillar ==="
  jq -r ".pillars[] | select(.name == \"$pillar\") | .tasks[] | \"\(.id): \(.status)\"" notion-template.json
done
```

## 🎨 YONI Design Principles

Alle Tasks sollten folgende Prinzipien berücksichtigen:

- 🟣 **Sicherheit** – Schutz der Nutzer:innen hat oberste Priorität
- 💜 **Würde** – Respektvoller Umgang mit sensiblen Themen
- 🌌 **Transzendenz** – Ästhetische Exzellenz (Überhochglitzer)
- 🧠 **Kompetenz** – Medizinisch/technisch fundiert
- 🪶 **Leichtigkeit** – Einfach, klar, barrierefrei

## 🔗 Links

- **Hauptprojekt:** [YONI-app](https://github.com/pappensex/YONI-app)
- **Dokumentation:** [README.md](../../README.md)
- **Workflows:** [WORKFLOW-DOCUMENTATION.md](../../WORKFLOW-DOCUMENTATION.md)
- **Demo:** [yoni.vercel.app](https://yoni.vercel.app)

## 📝 Notizen

- Tasks regelmäßig aktualisieren
- Git nutzen für Änderungsverfolgung
- Bei Bedarf mit GitHub Issues verknüpfen
- Überhochglitzer-Design in allen Deliverables beachten

---

**Version:** 1.0  
**Stand:** 2025-11-12  
**Maintainer:** [@pappensex](https://github.com/pappensex)

> _„Jeder Task ist ein Stern im YONI-Universum."_ ✨
