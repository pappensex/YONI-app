# 🔒 Repository Cleanup Instructions

## Overview

This PR provides the tools to remove sensitive data that was accidentally committed to the YONI-app repository's git history.

## ⚠️ Critical Security Issue

The following sensitive file was found in the repository:
- **`.github/workflows/yoni-x148.2025-11-03.private-key.pem`** - RSA private key (GitHub App)

This file exists in:
- ✅ Removed from this PR branch history
- ❌ **Still present in `main` branch and working tree**
- ❌ **Still in git history of other branches**

## 🎯 What This PR Provides

1. **`cleanup-sensitive-data.sh`** - Automated cleanup script
2. **`SECURITY_CLEANUP_REPORT.md`** - Detailed documentation
3. **Demonstration** - This PR branch shows the cleaned state

## 🚀 How to Execute the Cleanup

### Prerequisites

- You have administrator access to the repository
- You can force-push to protected branches
- All team members have been notified and pushed their work

### Steps

1. **Clone a fresh copy of the repository** (don't use an existing one):
   ```bash
   cd ~/
   git clone https://github.com/pappensex/YONI-app
   cd YONI-app
   ```

2. **Checkout main branch**:
   ```bash
   git checkout main
   ```

3. **Run the cleanup script**:
   ```bash
   ./cleanup-sensitive-data.sh
   ```
   
   The script will:
   - Create a backup
   - Remove sensitive files from history
   - Redact secret patterns
   - Clean up and optimize the repository
   - Restore clean versions of necessary files

4. **Review the changes**:
   ```bash
   git log --oneline -10
   git status
   
   # Verify no sensitive files exist
   find . -name "*.pem" -o -name "*.key" | grep -v node_modules
   ```

5. **Force push to main**:
   ```bash
   git push --force-with-lease origin main
   ```

6. **Notify all team members** to re-clone or force-fetch:
   ```bash
   # Option 1: Re-clone (recommended)
   cd ~/
   rm -rf YONI-app
   git clone https://github.com/pappensex/YONI-app
   
   # Option 2: Force fetch (for those who need to keep local changes)
   git fetch origin --force
   git reset --hard origin/main
   ```

7. **Rotate the exposed secrets**:
   - Generate a new GitHub App private key
   - Update any other secrets that may have been in removed files
   - Update Vercel environment variables if needed

## 🔍 What Gets Removed

The script removes from **all git history**:

### Files
- `.env` and all `*.env` files
- `*.pem` files (private keys)
- `*.key` files
- `*.p12` files (certificates)

### Secret Patterns (redacted to `REDACTED_*`)
- OpenAI API keys (`sk-...`)
- Stripe webhook secrets (`whsec_...`)
- GitHub tokens (`ghp_...`, `github_pat_...`)
- AWS access keys (`AKIA...`, `ASIA...`)

## ✅ Verification

After cleanup, verify:

```bash
# No sensitive files in working tree
find . -name "*.pem" | grep -v node_modules
# Should return nothing

# No sensitive files in git history
git log --all --pretty=format: --name-only | sort -u | grep -E '(\.pem|\.key|\.env)'
# Should return nothing

# No private keys in commit content
git log --all -S "BEGIN RSA PRIVATE KEY" --oneline
# Should return nothing
```

## 📋 Post-Cleanup Checklist

- [ ] Cleanup script executed successfully
- [ ] Changes reviewed
- [ ] Main branch force-pushed
- [ ] All team members notified
- [ ] Team members have re-cloned or force-fetched
- [ ] New GitHub App private key generated and configured
- [ ] Vercel environment variables updated (if needed)
- [ ] Old repository backups containing sensitive data deleted
- [ ] This PR branch `copilot/remove-sensitive-data` can be deleted

## 🆘 Troubleshooting

### "git-filter-repo not found"
```bash
pip install git-filter-repo
```

### "force push rejected"
You need admin permissions to force-push to protected branches. Either:
1. Temporarily disable branch protection
2. Add yourself to the force-push allowlist
3. Contact repository owner

### "conflicts after force fetch"
Don't try to merge. Use hard reset:
```bash
git fetch origin --force
git reset --hard origin/main
```

## 📞 Questions?

If you encounter issues or have questions about the cleanup process, please:
1. Review `SECURITY_CLEANUP_REPORT.md` for detailed information
2. Check the script `cleanup-sensitive-data.sh` for what it does
3. Contact the security team or repository maintainer

---

**Remember**: This cleanup rewrites history. Coordination with the team is essential!
