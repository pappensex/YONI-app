# 🚀 YONI Project-Ops Quick Reference

> Schnellreferenz für tägliche Task-Management-Operationen

## 📊 Häufige Kommandos

### JSON Template abfragen

```bash
# Navigation zum Verzeichnis
cd project-ops/launch

# Template-Titel
jq '.title' notion-template.json

# Alle Pillars
jq '.pillars[].name' notion-template.json

# BUILD Pillar Details
jq '.pillars[] | select(.name == "BUILD")' notion-template.json

# Alle Task-Kategorien für PAYMENT
jq '.pillars[] | select(.name == "PAYMENT") | .taskCategories[].category' notion-template.json

# Workflow-Stages
jq '.workflow.stages[] | "\(.icon) \(.name): \(.description)"' notion-template.json

# Quick Links
jq '.quickLinks' notion-template.json
```

### CSV Operationen

```bash
# Anzahl Tasks pro Pillar (ohne Header)
for file in tasks-*.csv; do 
    echo "$(basename $file): $(($(wc -l < $file) - 1)) tasks"
done

# Alle High-Priority Tasks
grep ",High," tasks-*.csv | cut -d',' -f1

# Tasks mit urgenten Tags
grep "urgent" tasks-*.csv | cut -d',' -f1,2,5

# BUILD Tasks nach Kategorie
grep "BUILD" tasks-all.csv | cut -d',' -f3 | sort | uniq -c

# Kommende Deadlines (nächste 7 Tage)
# Manuelle Filterung nach aktuellem Datum erforderlich
grep "2025-11-1[2-9]" tasks-*.csv

# Medium Effort Tasks
grep "Medium (3-8h)" tasks-*.csv | wc -l
```

### Task Statistiken

```bash
# Total Task Count
echo "Total Tasks: $(($(wc -l < tasks-all.csv) - 1))"

# Tasks pro Status
grep -o "Backlog" tasks-all.csv | wc -l
grep -o "In Progress" tasks-all.csv | wc -l
grep -o "Done" tasks-all.csv | wc -l

# Tasks pro Priority
echo "High: $(grep -c ",High," tasks-all.csv)"
echo "Medium: $(grep -c ",Medium," tasks-all.csv)"
echo "Low: $(grep -c ",Low," tasks-all.csv)"

# Tasks pro Tag
grep -o "urgent" tasks-*.csv | wc -l
grep -o "feature" tasks-*.csv | wc -l
grep -o "documentation" tasks-*.csv | wc -l
```

## 🎯 Pillar-spezifische Queries

### BUILD (🧱)

```bash
# Alle Backend Tasks
grep "BUILD,Backend" tasks-build.csv

# Frontend Tasks mit High Priority
grep "BUILD,Frontend" tasks-build.csv | grep "High"

# DevOps Tasks
grep "BUILD,DevOps" tasks-build.csv | cut -d',' -f1,9,10
```

### PAYMENT (💳)

```bash
# Stripe Integration Tasks
grep "Stripe Integration" tasks-payment.csv

# Compliance Tasks
grep "Compliance" tasks-payment.csv | cut -d',' -f1,5,7

# User Experience Tasks
grep "User Experience" tasks-payment.csv
```

### YOUTUBE (🎥)

```bash
# Content Creation Tasks
grep "Content Creation" tasks-youtube.csv

# Marketing Tasks mit Effort
grep "Marketing" tasks-youtube.csv | cut -d',' -f1,9

# Community Engagement
grep "Community Engagement" tasks-youtube.csv | cut -d',' -f1,7
```

## 📈 Reporting Templates

### Täglicher Standup

```bash
#!/bin/bash
echo "=== YONI Daily Standup $(date +%Y-%m-%d) ==="
echo ""
echo "📋 In Progress:"
grep "In Progress" tasks-all.csv | cut -d',' -f1,2 | head -5
echo ""
echo "✅ Recently Done:"
grep "Done" tasks-all.csv | cut -d',' -f1,2 | tail -3
echo ""
echo "🔥 High Priority Backlog:"
grep "Backlog" tasks-all.csv | grep "High" | cut -d',' -f1,2 | head -5
```

### Wöchentlicher Report

```bash
#!/bin/bash
echo "=== YONI Weekly Report Week $(date +%W) ==="
echo ""
echo "📊 Statistics:"
echo "- Total Tasks: $(($(wc -l < tasks-all.csv) - 1))"
echo "- In Progress: $(grep -c "In Progress" tasks-all.csv)"
echo "- Done: $(grep -c "Done" tasks-all.csv)"
echo "- High Priority: $(grep -c ",High," tasks-all.csv)"
echo ""
echo "🧱 BUILD: $(($(wc -l < tasks-build.csv) - 1)) tasks"
echo "💳 PAYMENT: $(($(wc -l < tasks-payment.csv) - 1)) tasks"
echo "🎥 YOUTUBE: $(($(wc -l < tasks-youtube.csv) - 1)) tasks"
```

## 🔍 Suche & Filter

### Text-basierte Suche

```bash
# Suche nach Keyword in Task Names
grep -i "stripe" tasks-*.csv

# Suche in Descriptions
awk -F',' '{print $10}' tasks-all.csv | grep -i "webhook"

# Alle Tasks mit bestimmtem Tag
grep ";feature" tasks-*.csv

# Kombinierte Suche: Pillar + Priority
grep "BUILD" tasks-all.csv | grep "High"
```

### Erweiterte Filterung

```bash
# Tasks ohne Assignee
grep ",,2025" tasks-all.csv

# Tasks mit Deadline diese Woche
grep "2025-11-1[2-8]" tasks-all.csv

# Large oder X-Large Tasks
grep -E "(Large|X-Large)" tasks-all.csv

# Kritische Tasks (High + urgent)
grep "High" tasks-all.csv | grep "urgent"
```

## 🛠️ Utility Scripts

### CSV nach Markdown Konvertierung

```bash
# Einfache Markdown Table
awk -F',' 'NR==1 {print "| "$1" | "$2" | "$5" | "$7" |"; 
                  print "|------|------|------|------|"} 
           NR>1 {print "| "$1" | "$2" | "$5" | "$7" |"}' tasks-build.csv
```

### JSON Export einzelner Pillars

```bash
# BUILD Pillar als JSON
jq '.pillars[] | select(.name == "BUILD")' notion-template.json > build-pillar.json

# Alle Beispiele für PAYMENT
jq '.pillars[] | select(.name == "PAYMENT") | .examples' notion-template.json
```

### Backup erstellen

```bash
# Backup mit Timestamp
tar -czf "project-ops-backup-$(date +%Y%m%d-%H%M%S).tar.gz" project-ops/
```

## ⚡ Pro-Tipps

1. **Alias erstellen**: `alias yoni-tasks='cd /path/to/YONI-app/project-ops/launch'`
2. **CSV in Excel**: Öffne mit Encoding UTF-8 für korrekte Umlaute
3. **JSON Pretty-Print**: `jq '.' notion-template.json > temp.json && mv temp.json notion-template.json`
4. **Watch Tasks**: `watch -n 60 'grep -c "In Progress" tasks-all.csv'`
5. **Git Diff CSV**: `git diff --word-diff tasks-*.csv` für bessere Lesbarkeit

## 📱 Mobile Access

Für mobilen Zugriff auf GitHub:
```
https://github.com/pappensex/YONI-app/tree/main/project-ops/launch
```

Notion Mobile App: Importiere CSV direkt aus GitHub Raw URL

## 🔗 Shortcuts

| Shortcut | Kommando | Beschreibung |
|----------|----------|--------------|
| `yt` | `jq '.title' notion-template.json` | Template Title |
| `yp` | `jq '.pillars[].name' notion-template.json` | Pillars |
| `yb` | `cat tasks-build.csv` | BUILD Tasks |
| `ypa` | `cat tasks-payment.csv` | PAYMENT Tasks |
| `yy` | `cat tasks-youtube.csv` | YOUTUBE Tasks |
| `ya` | `cat tasks-all.csv` | All Tasks |
| `ys` | `wc -l tasks-*.csv` | Statistics |

## 🆘 Troubleshooting

**Problem**: `jq: command not found`
```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq

# Windows (WSL)
sudo apt-get install jq
```

**Problem**: CSV Encoding-Fehler in Excel
- Lösung: Öffne mit "Text Import" und wähle UTF-8

**Problem**: Git merge conflict in CSV
```bash
# Accept local version
git checkout --ours tasks-*.csv

# Accept remote version
git checkout --theirs tasks-*.csv
```

---

**Quick Access**: `cat project-ops/launch/QUICK-REFERENCE.md`  
**Last Updated**: 2025-11-12
