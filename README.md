# Smart Leads Dashboard

A full-stack MERN Lead Management Dashboard built with TypeScript, Express, MongoDB, React, and TailwindCSS.

## Features

- JWT authentication with registration, login, protected routes, and bcrypt password hashing
- Role-based access control for `Admin` and `Sales User`
- Lead CRUD with typed validation
- Combined status/source/search filters
- Backend pagination with 10 records per page
- Latest/oldest sorting
- Debounced frontend search
- CSV export with active filters
- Responsive dashboard UI with loading, empty, and error states
- Dark mode support
- Docker setup for MongoDB, API, and frontend

## Tech Stack

Frontend: React, TypeScript, TailwindCSS, React Router, React Hook Form, Axios

Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod, JWT, bcrypt

## Project Structure

```text
client/
  src/
    api/
    components/
    context/
    hooks/
    pages/
    types/
    utils/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    schemas/
    types/
    utils/
docs/
  API.md
```

## Local Setup

1. Copy environment files:

```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Install dependencies:

```bash
npm run install:all
npm install
```

3. Start MongoDB locally or with Docker:

```bash
docker compose up mongo
```

4. Start development servers:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Docker Setup

```bash
docker compose up --build
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Seed Data

After MongoDB is running:

```bash
npm run seed --prefix server
```

Seed users:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `password123` |
| Sales User | `sales@example.com` | `password123` |

## API Documentation

See [docs/API.md](docs/API.md).

## Environment Variables

Server:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://admin:password@localhost:27017/smart_leads?authSource=admin
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Client:

```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

Root:

```bash
npm run dev
npm run build
npm run lint
```

Server:

```bash
npm run dev --prefix server
npm run build --prefix server
npm run seed --prefix server
```

Client:

```bash
npm run dev --prefix client
npm run build --prefix client
```
