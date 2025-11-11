# Copilot PR Import Script

This script automates the process of importing copilot tasks and creating pull requests with standardized formatting.

## Usage

```bash
./import-copilot-pr.sh <PR_NUMBER>
```

### Parameters

- `<PR_NUMBER>`: The number to assign to the PR (required)

### Example

```bash
./import-copilot-pr.sh 42
```

This will:
1. Push the current branch as `import/copilot-pr-42` to origin
2. Create a PR with title: `import: copilot/tasks PR 42`
3. Use the standard body: `Imported via patch; build ok; duplicate-route check clean.`

## Prerequisites

- Git must be installed and configured
- GitHub CLI (`gh`) must be installed and authenticated
- You must be on the branch you want to push before running the script

## Workflow

1. Make your changes or apply patches
2. Commit your changes to the local branch
3. Run the script with the desired PR number
4. The script will push the branch and create the PR automatically

## Notes

- The script will fail if the PR number is not provided
- The branch naming pattern is: `import/copilot-pr-<NUMBER>`
- The PR title pattern is: `import: copilot/tasks PR <NUMBER>`
- The PR body is always: `Imported via patch; build ok; duplicate-route check clean.`
