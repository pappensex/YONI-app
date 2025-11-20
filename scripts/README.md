# Scripts Directory

This directory contains utility scripts for the YONI app.

## Available Scripts

### Domain Management

#### `setup-domains.sh`

Automatically configures custom domains for the YONI app on Vercel.

**Configured Domains:**
- `pihoch2.me` - Root domain
- `www.pihoch2.me` - WWW subdomain  
- `app.pihoch2.me` - App subdomain
- `api.pihoch2.me` - API subdomain

**Prerequisites:**
- Vercel CLI installed: `npm i -g vercel`
- Authenticated with Vercel: `vercel login`

**Usage:**

```bash
# Dry run (shows what would be done without making changes)
./scripts/setup-domains.sh --dry-run

# Or via npm
npm run domains:setup:dry-run

# Add domains to Vercel
./scripts/setup-domains.sh

# Or via npm
npm run domains:setup
```

**Help:**

```bash
./scripts/setup-domains.sh --help
```

**After running the script:**

1. Configure DNS records with your DNS provider
2. Point each domain to: `cname.vercel-dns.com`
3. Wait for DNS propagation (5-30 minutes)
4. Verify with: `nslookup <domain>`

See `DEPLOYMENT.md` for detailed DNS configuration instructions.

---

### Notion Validation

#### `validate-notion.js`

Validates Notion template configuration.

**Usage:**

```bash
node scripts/validate-notion.js

# Or via npm
npm run validate:notion
```

---

### Local Development

#### `setup-local.sh`

Bootstraps a local environment by installing dependencies and preparing
environment variables.

**Usage:**

```bash
# Run the setup helper
./scripts/setup-local.sh

# Or via npm
npm run setup:local
```

The script will:
- Verify Node.js and npm are available
- Copy `.env.example` to `.env.local` if it does not yet exist
- Run `npm install`

---

## Adding New Scripts

When adding new scripts to this directory:

1. Make scripts executable: `chmod +x scripts/your-script.sh`
2. Add appropriate documentation to this README
3. Consider adding npm script shortcuts in `package.json`
4. Follow existing naming conventions
5. Include help/usage information in the script

---

## Troubleshooting

### "Vercel CLI is not installed"

Install the Vercel CLI globally:

```bash
npm i -g vercel
```

### "Not logged in to Vercel"

Login to Vercel:

```bash
vercel login
```

### Script Permission Denied

Make the script executable:

```bash
chmod +x scripts/setup-domains.sh
```

---

> _„Im Dunkel des Alls glitzert jeder Mensch als eigene Galaxie."_ ✨
