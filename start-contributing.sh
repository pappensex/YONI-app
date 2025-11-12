#!/bin/bash

# 🌟 YONI Contributing Helper Script
# This script helps you start contributing to YONI by setting up a feature branch

set -e

echo "✨ YONI Contributing Helper ✨"
echo ""

# Color codes for pretty output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get the current branch
CURRENT_BRANCH=$(git branch --show-current)

# Ask for feature name
echo -e "${BLUE}What feature or fix are you working on?${NC}"
echo -e "${PURPLE}(e.g., 'fix-contact-form', 'add-dark-mode', 'improve-accessibility')${NC}"
read -r -p "Feature name: " FEATURE_NAME

if [ -z "$FEATURE_NAME" ]; then
    echo "❌ Feature name cannot be empty"
    exit 1
fi

# Create branch name
BRANCH_NAME="feature/$FEATURE_NAME"

echo ""
echo -e "${GREEN}Creating branch: $BRANCH_NAME${NC}"

# Fetch latest changes
echo "📥 Fetching latest changes from origin..."
if git remote | grep -q '^origin$'; then
    if ! git fetch origin; then
        echo "⚠️  Warning: Failed to fetch from 'origin'. You may not have a network connection or the remote may not exist."
        echo "    Proceeding without fetching latest changes."
    fi
else
    echo "⚠️  Warning: Remote 'origin' does not exist. Skipping fetch."
fi

# Create and checkout new branch from main
if git show-ref --verify --quiet refs/heads/main; then
    BASE_BRANCH="main"
elif git show-ref --verify --quiet refs/remotes/origin/main; then
    BASE_BRANCH="origin/main"
else
    echo "⚠️  Warning: Could not find main branch, using current branch as base"
    BASE_BRANCH="$CURRENT_BRANCH"
fi

echo "🌱 Creating branch from $BASE_BRANCH..."
git checkout -b "$BRANCH_NAME" "$BASE_BRANCH" 2>/dev/null || {
    echo "❌ Branch $BRANCH_NAME already exists."
    echo "ℹ️  Checking out existing branch..."
    git checkout "$BRANCH_NAME"

    # Check if branch is up to date with base branch
    if ! git merge-base --is-ancestor "$BASE_BRANCH" "$BRANCH_NAME"; then
        echo "⚠️  Warning: '$BRANCH_NAME' is not up to date with '$BASE_BRANCH'."
        read -r -p "Do you want to reset '$BRANCH_NAME' to match '$BASE_BRANCH'? This will discard local changes on '$BRANCH_NAME'. [y/N]: " RESET_CONFIRM
        if [[ "$RESET_CONFIRM" =~ ^[Yy]$ ]]; then
            git reset --hard "$BASE_BRANCH"
            echo "✅ '$BRANCH_NAME' has been reset to '$BASE_BRANCH'."
        else
            echo "ℹ️  Keeping existing branch state."
        fi
    fi
}

echo ""
echo -e "${GREEN}✅ Ready to contribute!${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Make your changes"
echo "  2. Test your changes (open index.html or use 'vercel dev')"
echo "  3. Commit your changes:"
echo "     git add ."
echo "     git commit -m \"Your descriptive commit message\""
echo "  4. Push your branch:"
echo "     git push -u origin $BRANCH_NAME"
echo "  5. Create a pull request:"
echo "     gh pr create --fill"
echo ""
echo -e "${PURPLE}Happy coding! 💜✨${NC}"
echo ""
echo "Need help? Check out CONTRIBUTING.md or README.md"
