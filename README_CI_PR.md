# CI/PR Documentation for YONI App

This document describes the continuous integration (CI) features and pull request (PR) workflow for the YONI app.

## Overview

The YONI app uses GitHub Actions for continuous integration to ensure code quality and prevent common configuration errors. This document covers:

1. **Route Duplicate Guard** - Automated checking for duplicate routes in `vercel.json`
2. **Vercel Environment Sync Helper** - Tool for syncing environment variables with Vercel

---

## Route Duplicate Guard

### Purpose
The Route Duplicate Guard workflow automatically checks `vercel.json` for duplicate route definitions, preventing deployment issues and routing conflicts.

### How It Works
- **Trigger**: Runs on pull requests and pushes to `main` that modify `vercel.json`
- **Check**: Extracts all route `src` patterns and identifies duplicates
- **Validation**: Also validates that `vercel.json` is valid JSON

### What It Checks
```json
{
  "routes": [
    { "src": "^/contact$", "dest": "/contact.html" },
    { "src": "^/contact$", "dest": "/contact-alt.html" }  // ❌ Duplicate!
  ]
}
```

### Workflow File
`.github/workflows/route-duplicates.yml`

### When It Runs
- On pull requests that modify `vercel.json`
- On pushes to `main` branch that modify `vercel.json`

### What Happens on Failure
If duplicate routes are detected:
1. The workflow fails with exit code 1
2. A detailed error message shows which routes are duplicated
3. The PR cannot be merged until duplicates are resolved

### Example Output
```
🔍 Checking for duplicate routes in vercel.json...
✅ No duplicate routes found
🔍 Validating vercel.json schema...
✅ vercel.json is valid JSON
```

---

## Vercel Environment Sync Helper

### Purpose
The `vercel_env_sync.sh` script helps developers sync environment variables from local `.env` files to Vercel projects, streamlining the deployment configuration process.

### Prerequisites
- Vercel CLI must be installed: `npm i -g vercel`
- You must be authenticated: `vercel login`
- You must be linked to a project: `vercel link`

### Usage

#### List Current Environment Variables
```bash
./vercel_env_sync.sh --list
```

#### Sync .env File to Development Environment
```bash
./vercel_env_sync.sh --env-file .env --target development
```

#### Sync to Production
```bash
./vercel_env_sync.sh --env-file .env.production --target production
```

#### Sync to Preview
```bash
./vercel_env_sync.sh --env-file .env.preview --target preview
```

### Options
- `-e, --env-file FILE` - Specify .env file to sync (default: `.env`)
- `-t, --target ENV` - Target environment: `production`, `preview`, or `development` (default: `development`)
- `-l, --list` - List current Vercel environment variables
- `-h, --help` - Show help message

### Environment File Format
The script reads standard `.env` files:
```bash
# This is a comment
API_KEY=your_api_key_here
DATABASE_URL=postgresql://localhost/mydb
DEBUG=true
```

### Features
- ✅ Skips comments and empty lines
- ✅ Handles quoted and unquoted values
- ✅ Provides colored output for better readability
- ✅ Validates Vercel CLI is installed
- ✅ Continues on errors (variables that already exist)

### Example Output
```
✅ Vercel CLI is installed
ℹ️  Syncing environment variables from '.env' to Vercel (development environment)...
ℹ️  Adding API_KEY to development environment...
ℹ️  Adding DATABASE_URL to development environment...
ℹ️  Adding DEBUG to development environment...
✅ Environment sync complete!
```

---

## CI Workflow

### Main CI Workflow
File: `.github/workflows/main.yml`

This workflow runs on:
- Pushes to `main` and `releases/*` branches
- Pull requests targeting `main`

Steps:
1. Checkout repository
2. Set up Node.js (v20)
3. Install dependencies
4. Run linter (if available)
5. Run tests (if available)
6. Build project (if available)
7. Upload build artifacts

### Permissions
- `contents: read` - Read repository contents
- `pull-requests: write` - Comment on pull requests

---

## Best Practices

### For Pull Requests
1. Always test locally before creating a PR
2. Ensure `vercel.json` changes don't introduce duplicate routes
3. Update environment variables in Vercel when adding new .env variables
4. Keep route patterns unique and well-documented

### For Deployments
1. Use the environment sync helper to keep Vercel in sync with your .env files
2. Review the route duplicate check results before merging
3. Test routes locally before deploying

### For Route Definitions
```json
{
  "routes": [
    { "src": "^/contact$", "dest": "/contact.html" },
    { "src": "^/about$", "dest": "/about.html" }
  ]
}
```

- Use unique `src` patterns for each route
- Use regex patterns carefully to avoid conflicts
- Document complex routing rules in comments or README

---

## Troubleshooting

### Route Duplicate Check Fails
**Problem**: Workflow reports duplicate routes

**Solution**:
1. Check `vercel.json` for duplicate `src` patterns
2. Consolidate duplicate routes into a single definition
3. Ensure route patterns don't overlap unintentionally

### Vercel Sync Script Fails
**Problem**: `vercel: command not found`

**Solution**:
```bash
npm i -g vercel
vercel login
```

**Problem**: Environment variables not updating

**Solution**:
- Variables may already exist; remove them first in Vercel dashboard
- Check that your .env file has correct format
- Ensure you're targeting the correct environment

### JSON Validation Fails
**Problem**: `vercel.json is not valid JSON`

**Solution**:
1. Check for syntax errors (missing commas, quotes, brackets)
2. Use a JSON validator or linter
3. Ensure no trailing commas in arrays/objects

---

## Contributing

When adding new CI features:
1. Document them in this README
2. Ensure they run efficiently (don't slow down CI unnecessarily)
3. Provide clear error messages
4. Test thoroughly before merging

---

## Support

For issues with:
- **CI workflows**: Check GitHub Actions logs
- **Vercel sync**: Run with `--help` flag for usage
- **Route conflicts**: Review Vercel dashboard and documentation

