# YONI Workflow Documentation

This document describes the GitHub Actions workflows available in this repository and how to use them.

## Available Workflows

### 1. CI for YONI (x148) - `main.yml`

**Purpose:** Continuous Integration workflow that builds, tests, and validates the YONI application.

**Triggers:**
- **Automatic:** Pushes to `main` or `releases/*` branches
- **Automatic:** Pull requests targeting `main` branch
- **Manual:** Can be triggered via GitHub Actions UI

**What it does:**
1. Checks out the repository
2. Sets up Node.js 20
3. Installs dependencies
4. Runs linter (if available)
5. Runs tests (if available)
6. Builds the project (if available)
7. Uploads build artifacts

**Manual Trigger:**
1. Go to the **Actions** tab in GitHub
2. Select "CI for YONI (x148)" from the workflow list
3. Click **"Run workflow"** button
4. Select the branch to run on
5. Click **"Run workflow"** to start

### 2. Deploy Snapshot - `deploy_snapshot.yml`

**Purpose:** Creates daily snapshots of deployment status and sends email notifications.

**Triggers:**
- **Automatic:** Daily at midnight (UTC) via cron schedule
- **Manual:** Can be triggered via GitHub Actions UI

**What it does:**
1. Checks out the repository
2. Sets up Node.js 20
3. Creates a dated copy of the deployment status report
4. Updates the snapshot log
5. Commits and pushes changes back to the repository
6. Sends an HTML email notification with snapshot details

**Manual Trigger:**
1. Go to the **Actions** tab in GitHub
2. Select "📦 YONI Deploy Snapshot" from the workflow list
3. Click **"Run workflow"** button
4. Select the branch to run on (usually `main`)
5. Click **"Run workflow"** to start

## Required Secrets

The `deploy_snapshot.yml` workflow requires the following secrets to be configured in your repository:

### Email Configuration Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `MAIL_USER` | Gmail username for SMTP authentication | `your-email@gmail.com` |
| `MAIL_PASS` | Gmail app password (not your regular password) | `abcd efgh ijkl mnop` |
| `MAIL_TO` | Recipient email address(es) | `recipient@example.com` |

### Setting up Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **"New repository secret"**
4. Add each secret with its name and value
5. Click **"Add secret"**

### Gmail App Password Setup

For `MAIL_PASS`, you need to create a Gmail App Password:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to **Security** > **2-Step Verification** > **App passwords**
4. Generate a new app password for "Mail"
5. Use this 16-character password as the `MAIL_PASS` secret

## Repository Structure

The workflows expect the following directory structure:

```
YONI-app/
├── .github/
│   └── workflows/
│       ├── main.yml
│       └── deploy_snapshot.yml
├── Transzendenz/
│   └── Reports/
│       ├── Deploy-Status.md           # Main deployment status file
│       ├── Deploy-Status-YYYY-MM-DD.md # Daily snapshots (auto-generated)
│       └── snapshot-log.txt           # Snapshot event log
└── WORKFLOW-DOCUMENTATION.md          # This file
```

## Troubleshooting

### deploy_snapshot.yml fails with "No such file or directory"

**Problem:** The workflow cannot find `Transzendenz/Reports/Deploy-Status.md` or `snapshot-log.txt`

**Solution:** Ensure the following files exist in your repository:
- `Transzendenz/Reports/Deploy-Status.md`
- `Transzendenz/Reports/snapshot-log.txt`

These files should be committed to your repository before running the workflow.

### deploy_snapshot.yml fails to send email

**Problem:** Email sending step fails

**Possible causes:**
1. Missing or incorrect secrets (`MAIL_USER`, `MAIL_PASS`, `MAIL_TO`)
2. Invalid Gmail app password
3. Gmail account security settings blocking the app

**Solution:**
1. Verify all email secrets are set correctly
2. Ensure you're using an App Password, not your regular Gmail password
3. Check that 2FA is enabled on your Gmail account
4. Review Gmail security settings for blocked sign-in attempts

### deploy_snapshot.yml fails to push changes

**Problem:** Git push fails with authentication error

**Solution:** The workflow uses the `GITHUB_TOKEN` secret which is automatically provided by GitHub Actions. Ensure the workflow has write permissions:

1. Go to **Settings** > **Actions** > **General**
2. Under "Workflow permissions", ensure "Read and write permissions" is selected
3. Save the changes

### main.yml workflow not appearing in Actions UI

**Problem:** Cannot find the workflow to run manually

**Solution:** 
1. Ensure the workflow file exists in `.github/workflows/main.yml`
2. Verify the YAML syntax is correct
3. Push the changes to the repository
4. Refresh the Actions page

## Best Practices

1. **Test manually first:** Before relying on automatic triggers, test workflows manually to ensure they work correctly
2. **Monitor snapshot logs:** Regularly check `Transzendenz/Reports/snapshot-log.txt` to verify snapshots are running
3. **Keep secrets secure:** Never commit secrets to the repository
4. **Review artifacts:** Check uploaded artifacts after CI runs to ensure builds are successful
5. **Update status regularly:** Keep `Deploy-Status.md` up to date with current deployment status

## Support

For issues or questions about these workflows:
1. Check this documentation first
2. Review workflow run logs in the Actions tab
3. Consult GitHub Actions documentation: https://docs.github.com/actions
4. Open an issue in this repository with details about the problem

---

**Last Updated:** 2025-11-05  
**Version:** 1.0
