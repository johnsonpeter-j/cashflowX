# CashFlowX Server

Node.js Express server with CORS configuration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure allowed origins in `.env`:
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,https://yourdomain.com
```

## Running

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## CORS Configuration

The server is configured with CORS middleware that allows requests from specified origins. Configure allowed origins in the `.env` file using the `ALLOWED_ORIGINS` variable (comma-separated list).

If no `.env` file is provided, the server defaults to allowing:
- `http://localhost:3000`
- `http://localhost:19006` (Expo default)
- `http://localhost:8081` (React Native Metro)

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API information endpoint

