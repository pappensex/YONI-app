#!/bin/bash
# ==============================================================================
# YONI Repository Cleanup Script
# ==============================================================================
# This script cleans up WIP PRs and branches from the repository using GitHub CLI.
#
# USAGE:
#   bash cleanup.sh <owner/repo>
#   
# EXAMPLES:
#   bash cleanup.sh pappensex/YONI-app
#   DRY=true bash cleanup.sh pappensex/YONI-app  # Preview mode
#
# REQUIREMENTS:
#   - GitHub CLI (gh) must be installed and authenticated
#   - Run: gh auth login
#
# OPTIONS:
#   DRY=true    Set environment variable for preview mode (no deletions)
# ==============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if repository argument is provided
if [ $# -lt 1 ]; then
    echo -e "${RED}❌ Error: Repository argument required${NC}"
    echo ""
    echo "Usage: bash cleanup.sh <owner/repo>"
    echo "Example: bash cleanup.sh pappensex/YONI-app"
    echo ""
    echo "Options:"
    echo "  DRY=true    Preview mode (no deletions)"
    exit 1
fi

REPO="$1"
DRY_RUN="${DRY:-false}"

# Validate repository format
if [[ ! "$REPO" =~ ^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$ ]]; then
    echo -e "${RED}❌ Error: Invalid repository format${NC}"
    echo "Expected format: owner/repo"
    echo "Example: pappensex/YONI-app"
    exit 1
fi

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ Error: GitHub CLI (gh) not found${NC}"
    echo ""
    echo "Please install GitHub CLI:"
    echo "  https://cli.github.com/"
    echo ""
    echo "Or run: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Error: Not authenticated with GitHub CLI${NC}"
    echo ""
    echo "Please run: gh auth login"
    exit 1
fi

echo "======================================================================"
echo -e "${BLUE}🧹 YONI Repository Cleanup${NC}"
echo "======================================================================"
echo ""
echo "Repository: $REPO"
if [ "$DRY_RUN" = "true" ]; then
    echo -e "Mode: ${YELLOW}DRY RUN (Preview only, no changes)${NC}"
else
    echo -e "Mode: ${RED}LIVE (Will make changes)${NC}"
fi
echo ""
echo "This script will:"
echo "  • Close WIP PRs from Copilot"
echo "  • Delete branches with prefix 'copilot/'"
echo "  • Clean up merged branches"
echo ""

if [ "$DRY_RUN" != "true" ]; then
    read -p "Continue? (yes/no): " -r
    echo
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

# ==============================================================================
# Step 1: Close WIP PRs from Copilot
# ==============================================================================
echo "======================================================================"
echo -e "${GREEN}Step 1: Closing WIP PRs from Copilot${NC}"
echo "======================================================================"

prs=$(gh pr list --repo "$REPO" --state open --search "author:app/copilot in:title [WIP]" --json number --jq '.[].number' || true)

if [ -z "$prs" ]; then
    echo "No WIP PRs found."
else
    echo "Found WIP PRs: $prs"
    
    if [ "$DRY_RUN" = "true" ]; then
        echo -e "${YELLOW}[DRY RUN] Would close these PRs${NC}"
    else
        for n in $prs; do
            echo "Closing PR #$n..."
            gh pr close "$n" --repo "$REPO" --delete-branch=false || true
        done
        echo -e "${GREEN}✓ WIP PRs closed${NC}"
    fi
fi

echo ""

# ==============================================================================
# Step 2: Delete branches with prefix 'copilot/'
# ==============================================================================
echo "======================================================================"
echo -e "${GREEN}Step 2: Deleting branches with prefix 'copilot/'${NC}"
echo "======================================================================"

page=1
to_delete=""

echo "Fetching branches..."
while :; do
    resp=$(gh api -X GET "repos/$REPO/branches" -F per_page=100 -F page=$page 2>/dev/null || echo "[]")
    names=$(echo "$resp" | jq -r '.[].name' 2>/dev/null || true)
    
    [ -z "$names" ] && break
    
    matches=$(echo "$names" | grep '^copilot/' || true)
    if [ -n "$matches" ]; then
        to_delete="$to_delete"$'\n'"$matches"
    fi
    
    # Check if we got less than 100 results (last page)
    count=$(echo "$resp" | jq '. | length' 2>/dev/null || echo "0")
    [ "$count" -lt 100 ] && break
    
    page=$((page+1))
done

to_delete=$(echo "$to_delete" | sed '/^$/d' || true)

if [ -z "$to_delete" ]; then
    echo "No copilot/ branches found."
else
    echo "Found branches:"
    echo "$to_delete"
    echo ""
    
    if [ "$DRY_RUN" = "true" ]; then
        echo -e "${YELLOW}[DRY RUN] Would delete these branches${NC}"
    else
        while IFS= read -r br; do
            echo "Deleting branch: $br"
            gh api -X DELETE "repos/$REPO/git/refs/heads/$br" 2>/dev/null || echo "  (branch may be protected or already deleted)"
        done <<< "$to_delete"
        echo -e "${GREEN}✓ Branches deleted${NC}"
    fi
fi

echo ""

# ==============================================================================
# Step 3: Clean up merged branches (optional)
# ==============================================================================
echo "======================================================================"
echo -e "${GREEN}Step 3: Cleaning up merged copilot/ branches${NC}"
echo "======================================================================"

if [ "$DRY_RUN" = "true" ]; then
    echo -e "${YELLOW}[DRY RUN] Skipping merged branch cleanup in preview mode${NC}"
else
    # Check if we're in a git repository
    if [ -d .git ]; then
        echo "Fetching remote branches..."
        git fetch --prune 2>/dev/null || true
        
        merged_branches=$(git branch -r --merged origin/main 2>/dev/null | sed 's# *origin/##' | grep '^copilot/' || true)
        
        if [ -z "$merged_branches" ]; then
            echo "No merged copilot/ branches found."
        else
            echo "Found merged branches:"
            echo "$merged_branches"
            echo ""
            
            while IFS= read -r br; do
                echo "Pruning merged branch: $br"
                gh api -X DELETE "repos/$REPO/git/refs/heads/$br" 2>/dev/null || echo "  (branch may be protected or already deleted)"
            done <<< "$merged_branches"
            echo -e "${GREEN}✓ Merged branches cleaned up${NC}"
        fi
    else
        echo "Not in a git repository. Skipping merged branch cleanup."
        echo "Run this script from within the repository to clean up merged branches."
    fi
fi

echo ""
echo "======================================================================"
echo -e "${GREEN}✓ Cleanup complete!${NC}"
echo "======================================================================"

if [ "$DRY_RUN" = "true" ]; then
    echo ""
    echo -e "${YELLOW}This was a dry run. No changes were made.${NC}"
    echo "Run without DRY=true to apply changes:"
    echo "  bash cleanup.sh $REPO"
fi
