#!/bin/bash

# Script to import copilot tasks and create PR
# Usage: ./import-copilot-pr.sh <PR_NUMBER>

set -e

# Check if PR number is provided
if [ -z "$1" ]; then
  echo "Error: PR number is required"
  echo "Usage: $0 <PR_NUMBER>"
  exit 1
fi

PR_NUMBER="$1"
BRANCH_NAME="import/copilot-pr-${PR_NUMBER}"
PR_TITLE="import: copilot/tasks PR ${PR_NUMBER}"
PR_BODY="Imported via patch; build ok; duplicate-route check clean."

echo "=== Copilot Task Import Script ==="
echo "PR Number: ${PR_NUMBER}"
echo "Branch: ${BRANCH_NAME}"
echo ""

# Push branch to origin
echo "Pushing branch ${BRANCH_NAME} to origin..."
git push -u origin "${BRANCH_NAME}"

# Create PR using GitHub CLI
echo ""
echo "Creating pull request..."
gh pr create --fill \
  --title "${PR_TITLE}" \
  --body "${PR_BODY}"

echo ""
echo "✅ Done! PR created successfully."
