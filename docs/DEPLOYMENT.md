# Deployment Guide

## Deploying Frontend to Vercel

Because this project is an **Nx Monorepo**, Vercel needs specific configuration to understand where your Next.js application lives and where the build artifacts are output.

1.  **Import Project**: Go to Vercel Dashboard > Add New > Project, and select your `monospace` repository.

2.  **Configure Project Settings**:
    *   **Framework Preset**: Select `Next.js`.
    *   **Root Directory**: Click "Edit" and select `apps/frontend`. This tells Vercel your app logic is here.

3.  **Override Build Settings**:
    Since Nx builds the app from the root workspace and outputs to a shared `dist` folder, you must override the default settings:

    *   **Build Command**:
        ```bash
        cd ../.. && npx nx build frontend --configuration=production
        ```
        *Explanation: Move to repo root (`cd ../..`) and run the Nx build command.*

    *   **Output Directory**:
        ```bash
        ../../dist/apps/frontend/.next
        ```
        *Explanation: Nx places build artifacts in the `dist` folder at the root. We point Vercel to look there.*

    *   **Install Command** (Optional, but recommended for Bun):
        ```bash
        cd ../.. && bun install
        ```

4.  **Environment Variables**:
    *   Copy all variables from `apps/frontend/.env.production` to Vercel's Environment Variables page.

## Deploying Backend to Railway / Render / DigitalOcean

The backend is a NestJS application using Docker or standard Node.js runtime.

### Option 1: Docker (Recommended)
Use the `Dockerfile` for the backend (you may need to create one if it doesn't exist yet).

### Option 2: Node.js Runtime (e.g., Render.com)
1.  **Root Directory**: `.` (Keep as repo root)
2.  **Build Command**:
    ```bash
    npx nx build backend
    ```
3.  **Start Command**:
    ```bash
    node dist/apps/backend/main.js
    ```
