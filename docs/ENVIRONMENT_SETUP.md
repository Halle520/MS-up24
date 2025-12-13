# Environment Setup Guide

This guide details how to set up the **Development** and **Production** environments on Supabase and GitHub to match the project's split environment architecture.

## 1. Supabase Setup

To achieve true isolation, we recommend creating two separate Supabase projects.

### Step 1.1: Create Development Project
1.  Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2.  Click **"New Project"**.
3.  **Name**: `monospace-dev` (or similar).
4.  **Database Password**: Generate a strong password and **save it safely** (you will need it for the connection string).
5.  **Region**: Choose a region close to you/your users.
6.  Wait for the project to finish provisioning.

### Step 1.2: Get Development Credentials
Once `monospace-dev` is ready, go to **Project Settings > API**:
1.  **Project URL**: Copy this to your `apps/backend/.env.development` as `SUPABASE_URL`.
2.  **anon public key**: Copy this to `SUPABASE_ANON_KEY` (backend) and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (frontend).
3.  **service_role secret**: Copy this to `SUPABASE_SERVICE_ROLE_KEY`.

Go to **Project Settings > Database > Connection pooler**:
1.  **Connection String**: Copy the URI (Mode: Transaction).
2.  Replace `[YOUR-PASSWORD]` with the password you created.
3.  This is your `DATABASE_URL` for `apps/backend/.env.development`.

### Step 1.3: Initialize Database
Run the migrations to set up the tables in your new dev project:

```bash
# Ensure your apps/backend/.env has the DEV credentials
cp apps/backend/.env.development apps/backend/.env

# Run migration
cd apps/backend
bunx prisma migrate deploy
```

### Step 1.4: Repeat for Production
1.  Create another project `monospace-prod`.
2.  Get the credentials.
3.  Update `apps/backend/.env.production` and `apps/frontend/.env.production`.
4.  Run migrations against the prod database (careful! verify `.env` matches prod before running).

---

## 2. GitHub Setup

GitHub Environments allow you to manage secrets (like API keys) separately for Dev and Prod, and require approval for deployments.

### Step 2.1: Create Environments
1.  Go to your repository on GitHub.
2.  Navigate to **Settings > Environments**.
3.  Click **New environment**.
4.  Name it `development`.
5.  Click **New environment** again.
6.  Name it `production`.
    *   *Tip: For production, you can enable "Required reviewers" to prevent accidental deploys.*

### Step 2.2: Add Secrets
For **each** environment (`development` and `production`), click on it and scroll to **Environment secrets**. Add the following secrets using the values from your local `.env.[env]` files:

| Secret Name | Description |
|---|---|
| `DATABASE_URL` | The full Postgres connection string |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Private Service key |
| `AUTH0_CLIENT_SECRET` | Auth0 Secret (if different per env) |
| `JWT_SECRET` | Secret for verifying tokens |

### Step 2.3: Add Variables
Add these as **Environment variables** (non-sensitive data):

| Variable Name | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | `3000` (usually) |
| `FRONTEND_URL` | The URL where the frontend will live |

---

## 4. Deployment Checklists

For specific deployment instructions (especially for Vercel + Nx), please refer to the **[Deployment Guide](./DEPLOYMENT.md)**.

## 5. GitHub Actions (CI/CD)

To automate deployments, create a `.github/workflows/deploy.yml` file.

### Example Workflow Structure
This is a conceptual example of how a workflow uses environments:

```yaml
name: Deploy

on:
  push:
    branches: [ main, develop ]

jobs:
  deploy-dev:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: development  # <--- Loads 'development' secrets
    steps:
      - uses: actions/checkout@v4
      - name: Build and Deploy
        run: |
          echo "Deploying to Dev with DB: ${{ secrets.DATABASE_URL }}"
          # Add your actual deployment commands here (e.g., Vercel, Railway, Docker)

  deploy-prod:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production   # <--- Loads 'production' secrets
    steps:
      - uses: actions/checkout@v4
      - name: Build and Deploy
        run: |
          echo "Deploying to Prod..."
```
