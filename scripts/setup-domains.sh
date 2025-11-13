#!/bin/bash
# YONI App - Vercel Domain Setup Script
# This script adds custom domains to the Vercel project
# Usage: ./scripts/setup-domains.sh [--dry-run]

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Domains to add
DOMAINS=(
  "pihoch2.me"
  "www.pihoch2.me"
  "app.pihoch2.me"
  "api.pihoch2.me"
)

DRY_RUN=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --help)
      echo "Usage: $0 [--dry-run]"
      echo ""
      echo "Options:"
      echo "  --dry-run    Show what would be done without making changes"
      echo "  --help       Show this help message"
      exit 0
      ;;
  esac
done

echo -e "${BLUE}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     YONI App - Vercel Domain Setup Script        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}❌ Error: Vercel CLI is not installed${NC}"
  echo -e "${YELLOW}Please install it with: npm i -g vercel${NC}"
  exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
  echo -e "${RED}❌ Error: Not logged in to Vercel${NC}"
  echo -e "${YELLOW}Please login with: vercel login${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Vercel CLI is installed and authenticated${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}🔍 DRY RUN MODE - No changes will be made${NC}"
  echo ""
fi

echo -e "${BLUE}Domains to be added:${NC}"
for domain in "${DOMAINS[@]}"; do
  echo -e "  • $domain"
done
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}Would execute the following commands:${NC}"
  for domain in "${DOMAINS[@]}"; do
    echo -e "${YELLOW}  vercel domains add $domain${NC}"
  done
  echo ""
  echo -e "${GREEN}✓ Dry run complete${NC}"
  exit 0
fi

# Confirm before proceeding
read -p "Do you want to proceed? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Aborted by user${NC}"
  exit 0
fi

echo ""
echo -e "${BLUE}Adding domains to Vercel...${NC}"
echo ""

# Add each domain
for domain in "${DOMAINS[@]}"; do
  echo -e "${BLUE}Adding domain: $domain${NC}"
  
  if vercel domains add "$domain"; then
    echo -e "${GREEN}✓ Successfully added: $domain${NC}"
  else
    # Domain might already exist, check status
    echo -e "${YELLOW}⚠ Could not add $domain (might already exist)${NC}"
  fi
  echo ""
done

echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Setup Complete!                      ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Configure DNS records with your DNS provider"
echo -e "2. Point each domain to: ${YELLOW}cname.vercel-dns.com${NC}"
echo -e "3. Wait for DNS propagation (5-30 minutes)"
echo -e "4. Verify with: ${YELLOW}nslookup <domain>${NC}"
echo ""
echo -e "${BLUE}For detailed DNS configuration, see:${NC}"
echo -e "  ${YELLOW}DEPLOYMENT.md - Domain Configuration section${NC}"
echo ""
