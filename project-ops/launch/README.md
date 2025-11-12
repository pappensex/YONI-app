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
├── notion-template.json         # Strukturierte Task-Daten (Notion-kompatibel)
├── notion-template.schema.json  # JSON Schema (draft-07) für Validierung
├── validate-notion-template.js  # Validierungsscript für Datenqualität
├── test-validate.js             # Test-Suite für Validierung
├── fix-content.js               # Auto-Fix für JSON/CSV Normalisierung
├── tasks.csv                    # Flache Task-Liste (CSV)
└── README.md                    # Diese Dokumentation
```

## 🪄 Quickstart (lokal)

Wenn du das Repo klonst, kannst du die JSON und CSV lokal prüfen:

```bash
git clone https://github.com/pappensex/YONI-app.git
cd YONI-app/project-ops/launch
cat notion-template.json | jq '.title'
```

### ✅ Validierung

Das Template kann gegen das JSON Schema validiert und auf Datenqualität geprüft werden:

```bash
# Lokal im Verzeichnis
node validate-notion-template.js

# Oder mit npm (aus Root-Verzeichnis)
npm run validate:notion

# Tests ausführen
npm run test:notion

# Auto-Fixes anwenden (JSON/CSV normalisieren)
npm run fix:content

# Ausgabe (bei Erfolg):
# ✅ Schema validation passed
# ✅ All data quality checks passed
# ✅ No problematic emojis found
```

Das Validierungsscript prüft:
- ✓ **Erforderliche Felder**: `type`, `title`, `properties`, `views`, `rows`
- ✓ **JSON Schema (draft-07)**: Struktur und Datentypen
- ✓ **Datenqualität**: Task-IDs, Status, Prioritäten, Tags
- ✓ **Emoji-Kompatibilität**: Problematische Unicode-Zeichen
- ✓ **Konsistenz**: Workflow-Status, Duplikate, Farben

### 🔧 Auto-Fix

Das `fix:content` Script normalisiert automatisch JSON- und CSV-Dateien:

```bash
# Auto-Fixes anwenden
npm run fix:content

# Was wird korrigiert:
# - JSON: Konsistente 2-Leerzeichen-Einrückung
# - JSON/CSV: Unix-Zeilenenden (LF)
# - JSON/CSV: Trailing Whitespace entfernen
# - JSON/CSV: Trailing Newline sicherstellen
```

**Automatisierung via GitHub Actions:**
- Workflow `.github/workflows/content-auto-fix.yml`
- Triggert bei Änderungen in `project-ops/launch/**`
- Erstellt automatisch PR mit Korrekturen
- Idempotent: Sichere Mehrfachausführung

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

Die `tasks.csv` kann mit Standard-Tools analysiert werden:

```bash
# Alle Tasks anzeigen
cat tasks.csv

# BUILD-Tasks filtern
grep "^BUILD" tasks.csv

# High-Priority Tasks
grep ",high," tasks.csv

# Task-Zählung pro Pillar
cut -d, -f1 tasks.csv | tail -n +2 | sort | uniq -c
```

## 🎯 Task-Format

### Notion Database Format

Das Template folgt dem Notion Database Export Format und kann direkt in Notion importiert werden:

```json
{
  "type": "database",
  "title": "YONI Launch Task Management",
  "properties": {
    "Task ID": { "type": "title" },
    "Title": { "type": "rich_text" },
    "Status": { 
      "type": "status",
      "status": {
        "options": [
          { "name": "pending", "color": "gray" },
          { "name": "in_progress", "color": "blue" },
          ...
        ]
      }
    },
    ...
  },
  "views": [
    { "name": "All Tasks", "type": "table" },
    { "name": "By Pillar", "type": "board" }
  ],
  "rows": [
    {
      "properties": {
        "Task ID": { "title": [{ "text": { "content": "BUILD-001" } }] },
        "Title": { "rich_text": [{ "text": { "content": "..." } }] },
        ...
      }
    }
  ]
}
```

### Legacy JSON-Struktur (für Backward Compatibility)

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
Pillar,Task ID,Title,Description,Status,Priority,Tags,Example
BUILD,BUILD-001,Stripe Webhook fixen,Fix webhook integration,in_progress,high,"stripe,backend",Stripe Webhook fixen
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
3. `tasks.csv` hochladen
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
