# Conventional Commit Messages for Notion Template & CI Validation

This directory contains three versions of the Conventional Commit message
summarizing the addition of Notion template and CI validation features.

## Files

### 1. COMMIT_MESSAGE_OPTIMIZED.txt ⭐ (RECOMMENDED)

**Best for:** Actual git commits and PR descriptions

✓ Subject line: 49 characters (under 50)
✓ Body lines: max 69 characters (under 72)
✓ Follows Conventional Commits spec perfectly
✓ Comprehensive yet properly formatted

```bash
# Use in git commit
git commit -F COMMIT_MESSAGE_OPTIMIZED.txt

# Or copy for PR description
cat COMMIT_MESSAGE_OPTIMIZED.txt
```

### 2. COMMIT_MESSAGE_CONCISE.txt

**Best for:** Quick summaries and short documentation

- Compact version
- Same essential information
- Easier to scan quickly

### 3. COMMIT_MESSAGE.txt

**Best for:** Detailed documentation and reference

- Most comprehensive
- Slightly longer lines
- Good for documentation files

## Conventional Commits Format

All messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Our Implementation

- **Type:** `feat` (new feature)
- **Scope:** `ops` (operations/infrastructure)
- **Subject:** "add Notion template and CI validation"
- **Body:** Lists all 7 files with rationale
- **Footer:** References PR #49

## What's Documented

All commit messages summarize these additions from PR #49:

### Launch Task Management

- `project-ops/launch/notion-template.json`
- `project-ops/launch/tasks.csv`
- `project-ops/launch/README.md`

### Notion Formulas

- `core/modules/deploy-center/notionFormulas.ts`
- `core/modules/deploy-center/notionFormulas.test.ts`
- `core/modules/deploy-center/README.md`

### CI Validation

- `.github/workflows/main.yml`

## Rationale Summary

1. **Task Management:** Structured approach across BUILD, PAYMENT, YOUTUBE
2. **Notion Integration:** Formula parity for consistent calculations
3. **CI Validation:** Automated quality gates (lint/test/build)
4. **Documentation:** Quick-start guides and usage examples

## Usage Examples

### For Git Commit

```bash
git commit -F COMMIT_MESSAGE_OPTIMIZED.txt
```

### For Squash Merge

```bash
# Copy optimized version
cat COMMIT_MESSAGE_OPTIMIZED.txt | pbcopy  # macOS
cat COMMIT_MESSAGE_OPTIMIZED.txt | xclip   # Linux

# Paste into GitHub squash merge dialog
```

### For PR Description

```bash
# Use optimized version as PR description
gh pr create --title "feat(ops): add Notion template and CI validation" \
  --body-file COMMIT_MESSAGE_OPTIMIZED.txt
```

### For Release Notes

```bash
# Use concise version for changelog
cat COMMIT_MESSAGE_CONCISE.txt >> CHANGELOG.md
```

## Validation Checklist

✓ Subject line ≤50 characters
✓ Blank line after subject
✓ Body lines ≤72 characters
✓ Lists all files touched
✓ Explains rationale clearly
✓ References related issues/PRs
✓ Follows Conventional Commits spec

## Tips

- **Subject:** Be specific but concise
- **Body:** Explain WHAT and WHY, not HOW
- **Footer:** Link to issues/PRs for context
- **Breaking Changes:** Mark clearly if any (none here)

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Commit Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

---

**Version:** 1.0  
**Date:** 2025-11-12  
**Related PR:** #49
