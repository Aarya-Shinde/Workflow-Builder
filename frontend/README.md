# Workflow Builder

A full-stack AI pipeline app built with React, Node.js, MongoDB, and Google Gemini.

## Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI and GEMINI_API_KEY in .env
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
- `MONGODB_URI` — MongoDB Atlas connection string
- `GEMINI_API_KEY` — Google Gemini API key from aistudio.google.com
- `PORT` — Backend port (default 5000)

## Architecture
- Frontend: React 18 + Vite + Tailwind CSS + React Router
- Backend: Node.js + Express + Mongoose
- Database: MongoDB Atlas
- LLM: Google Gemini 2.5 Flash