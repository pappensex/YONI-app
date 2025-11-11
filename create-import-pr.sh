#!/bin/bash

# Script to create an import PR for YONI-app
# Usage: ./create-import-pr.sh <PR_NUMBER>

set -e

# Check if PR number is provided
if [ -z "$1" ]; then
  echo "Error: PR number is required"
  echo "Usage: $0 <PR_NUMBER>"
  echo "Example: $0 42"
  exit 1
fi

PR_NUMBER=$1
BRANCH_NAME="import/copilot-pr-${PR_NUMBER}"
PR_TITLE="import: copilot/tasks PR ${PR_NUMBER}"
PR_BODY="Imported via patch; verified build & route-guard."

echo "Creating import PR #${PR_NUMBER}..."
echo "Branch: ${BRANCH_NAME}"
echo "Title: ${PR_TITLE}"
echo ""

# Create and checkout the branch
echo "Step 1: Creating branch ${BRANCH_NAME}..."
git checkout -b "${BRANCH_NAME}"

# Push the branch to origin
echo "Step 2: Pushing branch to origin..."
git push -u origin "${BRANCH_NAME}"

# Create the PR using gh CLI
echo "Step 3: Creating pull request..."
gh pr create --fill --title "${PR_TITLE}" --body "${PR_BODY}"

echo ""
echo "✓ Import PR #${PR_NUMBER} created successfully!"
