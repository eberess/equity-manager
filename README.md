# Equity Manager - Case Study

A modern Fullstack Monorepo application designed to manage company shareholders. This project demonstrates a robust architecture using **NestJS**, **Vue 3**, and **MongoDB**.

## Architecture & Tech Stack

- **Monorepo**: Managed with `pnpm` workspaces.
- **Backend**: NestJS (TypeScript) with Mongoose for MongoDB modeling.
- **Frontend**: Vue 3 (Composition API) + Vite + TypeScript + Axios.
- **Infrastructure**: Dockerized MongoDB and Mongo Express for database management.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v8+)
- [Docker & Docker Compose](https://www.docker.com/)

## Quick Start

### 1. Database & Infrastructure
Start the database container (MongoDB + Mongo Express):
```bash
docker-compose up -d
```
*Access Mongo Express at: http://localhost:8081*

### 2. Backend (API)

Install dependencies and start the development server:
```bash
cd apps/api
pnpm install
pnpm run start:dev
```
*API is available at: http://localhost:3000*

### 3. Frontend (Web)

Install dependencies and start the Vite development server:
```bash
cd apps/web
pnpm install
pnpm run dev
```
*Web app is available at: http://localhost:5173*

Testing the Data Flow
1. **Seed the Database**: Navigate to `http://localhost:3000/users/seed` in your browser. This will create a default shareholder in MongoDB.

2. **Verify API**: Check `http://localhost:3000/users` to see the JSON list of shareholders.

3. **Check Frontend**: Refresh `http://localhost:5173` to see the data rendered in the Vue 3 application.

## Project Structure
```bash
├── apps/
│   ├── api/          # NestJS application (Backend)
│   └── web/          # Vue 3 application (Frontend)
├── docker-compose.yml # Infrastructure configuration
└── README.md
```

## Environment Variables

The project uses .env files for configuration. Ensure your API is correctly linked to MongoDB using the credentials defined in the root docker-compose.yml.