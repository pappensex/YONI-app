# 📝 Task Creation Templates

Quick templates für neue Tasks in den verschiedenen Pillars.

---

## 🧱 BUILD Tasks

### Backend Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[Feature Name]",BUILD,Backend,Backlog,Medium,,YYYY-MM-DD,feature,Medium (3-8h),"Detailed description of the backend feature or fix"
```

**Beispiel:**
```csv
Fix Authentication Token Refresh,BUILD,Backend,Backlog,High,,2025-11-25,urgent;bug,Small (1-2h),Fix race condition in JWT token refresh logic
```

### Frontend Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[Component/Feature Name]",BUILD,Frontend,Backlog,Medium,,YYYY-MM-DD,feature,Medium (3-8h),"Detailed description of the frontend component or feature"
```

**Beispiel:**
```csv
Implement Loading Skeleton for Chat,BUILD,Frontend,Backlog,Medium,,2025-11-23,feature,Small (1-2h),Add skeleton loading states for better UX during chat message loading
```

### DevOps Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[Infrastructure/Pipeline Name]",BUILD,DevOps,Backlog,High,,YYYY-MM-DD,urgent,Medium (3-8h),"Detailed description of infrastructure or deployment task"
```

**Beispiel:**
```csv
Setup Redis Cache Layer,BUILD,DevOps,Backlog,High,,2025-11-20,feature,Large (1-3d),Configure Redis for session management and API caching
```

---

## 💳 PAYMENT Tasks

### Stripe Integration Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[Payment Feature]",PAYMENT,Stripe Integration,Backlog,High,,YYYY-MM-DD,urgent;feature,Medium (3-8h),"Detailed description of Stripe integration task"
```

**Beispiel:**
```csv
Implement Proration for Plan Upgrades,PAYMENT,Stripe Integration,Backlog,High,,2025-11-26,feature,Medium (3-8h),Handle proration when users upgrade from basic to premium plan
```

### Compliance Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[Compliance Requirement]",PAYMENT,Compliance,Backlog,High,,YYYY-MM-DD,urgent;documentation,Medium (3-8h),"Detailed description of compliance requirement"
```

**Beispiel:**
```csv
Update Cookie Consent for Payment Data,PAYMENT,Compliance,Backlog,High,,2025-11-22,urgent;documentation,Small (1-2h),Update cookie consent banner to include payment processing cookies
```

### User Experience Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[UX Improvement]",PAYMENT,User Experience,Backlog,Medium,,YYYY-MM-DD,feature,Small (1-2h),"Detailed description of payment UX improvement"
```

**Beispiel:**
```csv
Add Payment Method Preview,PAYMENT,User Experience,Backlog,Medium,,2025-11-27,feature,Small (1-2h),Show masked card number preview before charging
```

---

## 🎥 YOUTUBE Tasks

### Content Creation Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[Content Title]",YOUTUBE,Content Creation,Backlog,High,,YYYY-MM-DD,feature,Large (1-3d),"Detailed description of content to be created"
```

**Beispiel:**
```csv
YouTube Short: App Onboarding Flow,YOUTUBE,Content Creation,Backlog,High,,2025-11-24,feature,Medium (3-8h),Create 60-second Short showcasing easy onboarding process
```

### Community Engagement Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[Engagement Activity]",YOUTUBE,Community Engagement,Backlog,Medium,,YYYY-MM-DD,feature,Small (1-2h),"Detailed description of community engagement activity"
```

**Beispiel:**
```csv
Weekly Mental Health Q&A Post,YOUTUBE,Community Engagement,Backlog,Medium,,2025-11-21,feature,Small (1-2h),Create community post for weekly Q&A session
```

### Marketing Task
```csv
Task Name,Pillar,Category,Status,Priority,Assignee,Due Date,Tags,Effort,Description
"[Marketing Campaign/Activity]",YOUTUBE,Marketing,Backlog,High,,YYYY-MM-DD,urgent;feature,X-Large (>3d),"Detailed description of marketing activity"
```

**Beispiel:**
```csv
Launch Campaign on Twitter/X,YOUTUBE,Marketing,Backlog,High,,2025-11-19,urgent;feature,Large (1-3d),Coordinate launch announcement campaign across social media
```

---

## 📋 Field Definitions

### Task Name
- Kurz und prägnant (max 50 Zeichen)
- Beginnt mit Verb (z.B. "Implement", "Fix", "Create", "Update")
- Spezifisch genug, um Scope zu verstehen

### Pillar
- **BUILD**: Technische Infrastruktur und Code
- **PAYMENT**: Zahlungen, Compliance, Monetarisierung
- **YOUTUBE**: Marketing, Content, Community

### Category
Abhängig vom Pillar:
- **BUILD**: Backend, Frontend, DevOps
- **PAYMENT**: Stripe Integration, Compliance, User Experience
- **YOUTUBE**: Content Creation, Community Engagement, Marketing

### Status
- **Backlog**: Geplant, aber nicht gestartet
- **In Progress**: Aktiv in Bearbeitung
- **Review**: Wartet auf Code Review oder Testing
- **Done**: Abgeschlossen und deployed

### Priority
- **High**: Blockiert andere Tasks oder zeitkritisch
- **Medium**: Wichtig, aber nicht blockierend
- **Low**: Nice-to-have

### Assignee
- Leer lassen für unassigned
- GitHub Username oder Notion User

### Due Date
- Format: `YYYY-MM-DD`
- Sollte realistisch sein basierend auf Effort

### Tags
- Mehrere Tags mit Semikolon trennen: `urgent;feature`
- Verfügbare Tags: `urgent`, `bug`, `feature`, `improvement`, `documentation`

### Effort
- **Small (1-2h)**: Quick wins, kleine Fixes
- **Medium (3-8h)**: Standard Feature, halber bis ganzer Tag
- **Large (1-3d)**: Komplexe Features, mehrere Tage
- **X-Large (>3d)**: Epics, sollten aufgeteilt werden

### Description
- Ausführliche Beschreibung des Tasks
- Was soll erreicht werden?
- Acceptance Criteria erwähnen
- Dependencies falls vorhanden

---

## 🚀 Schnellanleitung

### 1. Template kopieren
Wähle das passende Template oben basierend auf Pillar und Category.

### 2. Felder ausfüllen
Ersetze alle Platzhalter (`[...]`, `YYYY-MM-DD`, etc.) mit konkreten Werten.

### 3. CSV aktualisieren
```bash
# Zur richtigen CSV-Datei hinzufügen
echo 'Your,Task,Data,Here,...' >> tasks-build.csv
# oder tasks-payment.csv oder tasks-youtube.csv
```

### 4. Master CSV aktualisieren
```bash
cd /home/runner/work/YONI-app/YONI-app/project-ops/launch
(head -n 1 tasks-build.csv && tail -n +2 tasks-*.csv) > tasks-all.csv
```

### 5. Validieren
```bash
# Zeile zählen (sollte +1 sein)
wc -l tasks-all.csv

# Neuen Task anzeigen
tail -n 1 tasks-[pillar].csv
```

### 6. Committen
```bash
git add project-ops/launch/tasks-*.csv
git commit -m "[TASK] Add [Task Name]"
git push
```

---

## ✨ Best Practices

### DO ✅
- Einen Task = Eine konkrete Deliverable
- Klare, actionable Task Names
- Realistische Due Dates setzen
- Dependencies in Description erwähnen
- Tags konsequent verwenden

### DON'T ❌
- Zu große Tasks (aufteilen wenn >3 Tage)
- Vage Beschreibungen ("Fix stuff")
- Unrealistische Deadlines
- Zu viele High-Priority Tasks
- Tasks ohne klare Acceptance Criteria

---

## 📊 Beispiel: Neues Feature Ende-zu-Ende

### Epic: "User Profile Picture Upload"

Aufgeteilt in 3 Tasks:

**1. BUILD (Backend)**
```csv
Implement Profile Picture Upload API,BUILD,Backend,Backlog,High,,2025-11-20,feature,Medium (3-8h),Create API endpoint for image upload with validation and S3 storage
```

**2. BUILD (Frontend)**
```csv
Create Profile Picture Upload UI,BUILD,Frontend,Backlog,High,,2025-11-21,feature,Medium (3-8h),Build upload component with preview and cropping functionality
```

**3. PAYMENT (Compliance)**
```csv
Update Privacy Policy for Image Storage,PAYMENT,Compliance,Backlog,Medium,,2025-11-22,documentation,Small (1-2h),Add section about profile picture storage and processing
```

---

**Template Version**: 1.0  
**Last Updated**: 2025-11-12  
**Maintainer**: [@pappensex](https://github.com/pappensex)
