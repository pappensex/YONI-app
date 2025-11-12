# 📋 YONI Project Operations

This directory contains project management and operational documentation for the YONI app.

## 📁 Directory Structure

```
project-ops/
└── launch/
    ├── launch_tasks.csv       # Main launch task tracker
    └── README.md              # This file
```

## 🚀 Launch Tasks Tracker

The `launch_tasks.csv` file tracks all tasks required for the YONI app launch.

### File Format

The CSV is structured with the following columns:

| Column | Description | Values |
|--------|-------------|---------|
| **Task ID** | Unique identifier for the task | Numeric (1, 2, 3...) |
| **Task Name** | Short, descriptive task name | Text |
| **Category** | Task category/domain | Infrastructure, Backend, Frontend, Design, Feature, Security, Quality, Documentation, Legal, Marketing, Launch, Operations |
| **Description** | Detailed task description | Text |
| **Status** | Current task status | `Done`, `In Progress`, `To Do` |
| **Progress** | Numerical progress value | 1 (Done), 0.5 (In Progress), 0 (To Do) |
| **Priority** | Task priority level | Critical, High, Medium, Low |
| **Assigned To** | Team or person responsible | Team name |
| **Due Date** | Target completion date | YYYY-MM-DD format |
| **Dependencies** | Task IDs this task depends on | Comma-separated Task IDs |
| **Notes** | Additional context or information | Text |

### Progress Calculation

The **Progress** column uses the following formula (compatible with Notion):

```
if(prop("Status") == "Done", 1, if(prop("Status") == "In Progress", 0.5, 0))
```

- **Done**: Progress = 1 (100%)
- **In Progress**: Progress = 0.5 (50%)
- **To Do**: Progress = 0 (0%)

This allows for easy calculation of overall project completion:
```
Overall Progress = SUM(Progress) / COUNT(Tasks) * 100%
```

### Using with Notion

To import this CSV into Notion:

1. Create a new Database in Notion
2. Click "Import" → "CSV"
3. Upload `launch_tasks.csv`
4. Map the columns appropriately
5. Add a formula property for Progress (if not imported):
   ```
   if(prop("Status") == "Done", 1, if(prop("Status") == "In Progress", 0.5, 0))
   ```

### Task Categories

- **Infrastructure**: Deployment, CI/CD, hosting, databases
- **Backend**: API routes, server logic, webhooks
- **Frontend**: UI components, pages, client-side features
- **Design**: Visual design, animations, theming
- **Feature**: User-facing functionality
- **Security**: Authentication, authorization, CSP, audits
- **Quality**: Testing, accessibility, performance
- **Documentation**: User guides, API docs, legal disclaimers
- **Legal**: DSGVO compliance, terms of service
- **Marketing**: Launch materials, communication
- **Launch**: Release activities
- **Operations**: Monitoring, maintenance

### Current Status Overview (as of 2025-11-12)

| Status | Count | Percentage |
|--------|-------|------------|
| Done | 4 | 10% |
| In Progress | 4 | 10% |
| To Do | 32 | 80% |

**Overall Progress**: ~12.5% (calculated: (4×1 + 4×0.5) / 40 = 0.125)

### Critical Path Tasks

The following tasks are on the critical path to launch:

1. User Authentication (#10) - Security foundation
2. Database Setup (#11) - Data persistence
3. Content Security Policy (#12) - Security compliance
4. DSGVO Compliance Audit (#19) - Legal requirement
5. Crisis Resources Integration (#28) - Safety requirement
6. Community Guidelines (#32) - Governance
7. Final Security Audit (#37) - Pre-launch validation
8. Soft Launch (#38) - Controlled rollout
9. Public Launch (#40) - Go-live

### Key Milestones

- **2025-11-30**: Security & Legal fundamentals (Tasks #10, #12, #21, #28, #32)
- **2025-12-10**: Core features complete (Tasks #13, #14, #15)
- **2025-12-20**: QA & Security audits (Tasks #34, #37)
- **2025-12-22**: Soft launch with beta users (Task #38)
- **2026-01-05**: Public launch 🎉 (Task #40)

## 🔄 Updating the Tracker

To update task status:

1. Open `launch_tasks.csv` in a text editor or spreadsheet application
2. Modify the **Status** column to reflect current state
3. The **Progress** column will be automatically calculated when imported to Notion
4. Update **Notes** column with relevant updates
5. Commit changes with a descriptive message

Example commit message:
```
Update launch tasks: Mark User Authentication as In Progress
```

## 📊 Reporting

For project status reports, use the following metrics:

- **Completion Rate**: Tasks with Status = "Done" / Total Tasks
- **Weighted Progress**: SUM(Progress) / COUNT(Tasks)
- **Tasks by Priority**: Group and count by Priority level
- **Tasks by Category**: Group and count by Category
- **Overdue Tasks**: Tasks where Due Date < Today and Status != "Done"

## 🎯 YONI Project Values

All tasks align with YONI's core principles:

- 🟣 **Sicherheit** (Safety) - Technical and psychological protection
- 💜 **Würde** (Dignity) - Every individual is unique and invaluable
- 🌌 **Transzendenz** (Transcendence) - Aesthetics bridging inner world and cosmos
- 🧠 **Kompetenz** (Competence) - Medically sound, expert-reviewed content
- 🪶 **Leichtigkeit** (Lightness) - Minimalism, accessibility, clear language

---

**Last Updated**: 2025-11-12  
**Project**: YONI - Überhochglitzer App  
**Owner**: [@pappensex](https://github.com/pappensex)
