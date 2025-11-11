# YONI Next.js Setup

This repository contains the YONI web and API components. Follow these instructions to get up and running.

## Local Setup

1. Ensure Node.js and npm are installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in environment variables.
4. Start development server:
   ```bash
   npm run dev -p 3000
   ```

## Codespaces Setup

A Dev Container configuration is provided via the `.devcontainer` directory.

1. Create a Codespace on the `main` branch.
2. Codespaces will automatically install dependencies and forward port 3000.
3. Expose port 3000 and access the application at the forwarded URL.

The `.vscode` folder contains recommended tasks for running the development server.
