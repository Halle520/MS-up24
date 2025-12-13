# Project Intention

## Overview

**Monospace** is a modern **Collaborative Consumption & Financial Planning Platform**. It empowers individuals and groups to track expenses ("consumptions"), chat in real-time to discuss finances, and build actionable plans for their future savings. It combines the engagement of a social chat app with the analytical power of a personal finance tool.

## Core Purpose

The project serves as a comprehensive tool for financial mindfulness and collaboration:

1.  **Connect**: Allow users to form groups (e.g., families, roommates, travel buddies) to manage shared finances.
2.  **Track**: Simplify the process of logging daily consumptions, making it as easy as sending a message.
3.  **Analyze**: Provide deep insights into spending habits through interactive reports.
4.  **Plan**: Enable users to forecast their savings, create budgets, and visualize their financial timeline.

## Primary Goals

### 1. Collaborative Expense Management
-   **Group Chat Integration**: Core interaction happens in chat. Users can discuss expenses and "send" consumptions directly within the conversation.
-   **Shared Context**: Seamlessly switch between individual tracking and group/shared expenses.
-   **Real-time Updates**: Instant visibility of new consumptions for all group members.

### 2. Powerful Reporting & Analytics
-   **Granular Reports**: View consumption data by User, Group, Category, or timeframe (Daily, Monthly, Annually).
-   **Interactive Data**: Users can drill down into charts and graphs to understand where their money goes.
-   **Current Save Cost**: A clear, real-time view of money saved vs. money spent.

### 3. Financial Planning & Forecasting
-   **Timeline Builder**: A feature for users to "build" their future. Users can set a target amount and see a timeline of when they will reach it based on current habits.
-   **Budget Creation**: Create smart budget plans that alert users when they are approaching limits.
-   **Savings Preview**: Visual tools to simulate how changes in daily consumption impact long-term savings.

### 4. Frictionless User Experience
-   **Fast-Add**: Minimize the steps required to log an expense.
-   **Visual Richness**: Use masonry grids and rich media to show "consumptions" (e.g., photos of receipts on the gallery page) alongside data.
-   **Cross-Platform Ready**: Designed for use on both desktop and mobile for on-the-go tracking.

## Key Features

### Social Finance
-   **Login & Authentication**: Secure access via Auth0.
-   **Chat Interface**: A familiar chat UI that supports text, images (receipts), and special "Consumption Cards".

### Tracking & Data
-   **Daily Consumptions**: Log items with cost, category, and optional notes/images.
-   **Smart Categorization**: Tag consumptions for better filtering.

### Intelligence
-   **Budget Planner**: Set monthly or category-based limits.
-   **Savings Timeline**: "If I save $X/day, when can I buy Y?" calculator and visualizer.
-   **Trend Analysis**: "You spent 20% more on dining this month" insights.

## Success Criteria

A successful implementation should:
-   ✅ Enable frictionless logging of daily consumptions.
-   ✅ Foster communication through a robust Chat interface.
-   ✅ Generate accurate and beautiful financial reports (Monthly/Annually).
-   ✅ Help users visualize their savings goals with the Timeline Builder.
-   ✅ Provide a "Current Save Cost" view that motivates saving.
-   ✅ Support both individual privacy and group transparency.

## Technology Philosophy

-   **User-Centric Data**: All features serve to help the user understand their data.
-   **Real-Time First**: Finanical data and chat messages sync instantly.
-   **Modern Stack**: Leveraging Next.js 15, NestJS, and Prisma for a robust, type-safe foundation.
