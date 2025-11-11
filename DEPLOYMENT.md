# YONI-app Deployment Guide

## Vercel Deployment

This guide explains how to deploy the YONI-app to Vercel.

### Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Node.js installed on your system (for Vercel CLI)

### Option 1: Deploy via Vercel CLI (Recommended)

#### 1. Install Vercel CLI

You can install the Vercel CLI globally:

```bash
npm i -g vercel
```

Or use it directly with npx (no installation required):

```bash
npx vercel
```

#### 2. Link Your Project

Link this repository to your Vercel project:

```bash
vercel link
```

Follow the prompts to:
- Select or create a Vercel project
- Confirm the project settings
- Link the current directory to the Vercel project

#### 3. Deploy

For a production deployment:

```bash
vercel --prod
```

For a preview deployment:

```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Vercel will automatically detect the configuration from `vercel.json`
5. Click "Deploy"

### Configuration

The project includes a `vercel.json` file with the following configuration:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "routes": [{ "src": "^/contact$", "dest": "/contact.html" }]
}
```

This ensures that the `/contact` route properly serves the contact page.

### Automatic Deployments

When connected via the Vercel Dashboard:
- **Production deployments**: Automatically triggered on push to `main` branch
- **Preview deployments**: Automatically created for pull requests

### Environment Variables

If your application requires environment variables (e.g., API keys), you can set them:

1. Via CLI:
   ```bash
   vercel env add
   ```

2. Via Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add your variables for Production, Preview, or Development environments

### Custom Domain

To add a custom domain:

1. Via CLI:
   ```bash
   vercel domains add yourdomain.com
   ```

2. Via Dashboard:
   - Go to your project settings
   - Navigate to "Domains"
   - Add and configure your custom domain

### Troubleshooting

- **Build fails**: Check the build logs in the Vercel dashboard
- **Routes not working**: Verify your `vercel.json` configuration
- **Environment variables missing**: Ensure they are set in the correct environment (Production/Preview/Development)

For more information, visit the [Vercel Documentation](https://vercel.com/docs).
