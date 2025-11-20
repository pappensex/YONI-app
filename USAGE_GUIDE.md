# Quick Usage Guide - Commit Messages

## Recommended Use

**For this PR/commit:**

```bash
# The optimized version is already perfect for direct use
git commit -F COMMIT_MESSAGE_OPTIMIZED.txt
```

## What Was Generated

Three commit message files documenting the Notion template and CI validation additions:

| File                              | Subject Length | Use Case                         |
| --------------------------------- | -------------- | -------------------------------- |
| `COMMIT_MESSAGE_OPTIMIZED.txt` ⭐ | 49 chars       | **Recommended** - Perfect format |
| `COMMIT_MESSAGE_CONCISE.txt`      | 64 chars       | Quick summaries                  |
| `COMMIT_MESSAGE.txt`              | 71 chars       | Detailed documentation           |

## The Commit Message

**Type:** `feat` (feature addition)  
**Scope:** `ops` (operations/infrastructure)  
**Subject:** add Notion template and CI validation

**Files Documented:**

1. `project-ops/launch/notion-template.json` - Task template (BUILD/PAYMENT/YOUTUBE)
2. `project-ops/launch/tasks.csv` - CSV export
3. `project-ops/launch/README.md` - Launch ops documentation
4. `core/modules/deploy-center/notionFormulas.ts` - Formula utilities
5. `core/modules/deploy-center/notionFormulas.test.ts` - Tests
6. `core/modules/deploy-center/README.md` - Formula docs
7. `.github/workflows/main.yml` - CI validation

**Rationale:**

- Task management structure for launch
- Notion formula integration for consistency
- Automated CI gates (lint/test/build)
- Comprehensive documentation

## Quick Commands

### View Messages

```bash
# Recommended (optimized)
cat COMMIT_MESSAGE_OPTIMIZED.txt

# Concise version
cat COMMIT_MESSAGE_CONCISE.txt

# Detailed version
cat COMMIT_MESSAGE.txt
```

### Copy to Clipboard

```bash
# macOS
cat COMMIT_MESSAGE_OPTIMIZED.txt | pbcopy

# Linux
cat COMMIT_MESSAGE_OPTIMIZED.txt | xclip -selection clipboard

# Windows (Git Bash)
cat COMMIT_MESSAGE_OPTIMIZED.txt | clip
```

### Use in Git

```bash
# Direct commit
git commit -F COMMIT_MESSAGE_OPTIMIZED.txt

# Edit before commit
git commit -e -F COMMIT_MESSAGE_OPTIMIZED.txt
```

## Validation Results

**COMMIT_MESSAGE_OPTIMIZED.txt:**

- ✓ Subject: 49 chars (under 50 limit)
- ✓ Body lines: max 69 chars (under 72 limit)
- ✓ Blank line after subject
- ✓ Conventional Commits compliant
- ✓ Lists all files with descriptions
- ✓ Clear rationale sections
- ✓ References PR #49

## Next Steps

1. Review the optimized commit message
2. Use it for PR description or commit
3. Reference these files for future commits

---

**Quick Answer:** Use `COMMIT_MESSAGE_OPTIMIZED.txt` - it's perfect! ✨
