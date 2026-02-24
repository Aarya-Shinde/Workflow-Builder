# Workflow Builder

A powerful, modular text processing application that lets you chain multiple AI-powered transformations together. Built with Node.js/Express backend, React frontend, and Google Gemini AI.

**Live Demo:** https://workflow-builder-hzft.onrender.com (Render backend) + Vercel frontend

---

## 📋 Table of Contents

- [Features](#features)
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- **Workflow Management:** Create, edit, and manage custom text processing workflows
- **AI-Powered Processing:** Chain multiple Gemini AI transformations:
  - Text Cleaning (remove whitespace, fix grammar)
  - Summarization (condense text to key points)
  - Key Point Extraction (bullet-point format)
  - Auto-Categorization (classify into 5 categories)
- **Run History:** Track and view past workflow executions
- **Health Monitoring:** Real-time status dashboard for backend services
- **Responsive UI:** Modern React interface with Tailwind CSS styling

---

## 🏗️ Project Overview

**Workflow Builder** is a full-stack application that demonstrates:
- Backend API design with Express.js
- MongoDB data persistence
- Integration with Google Gemini API
- Frontend-backend communication patterns
- Production-ready deployment on Render + Vercel

The core concept: Users define a sequence of text transformation steps, then execute them on input text. Each step's output becomes the next step's input, creating a pipeline.

---

## 🎯 Architecture

### Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB (Atlas)
- Axios (HTTP client)
- Google Gemini AI API (v1beta)

**Frontend:**
- React 18+ with Vite
- Tailwind CSS
- Axios for API calls

**Deployment:**
- Backend: Render (Node.js)
- Frontend: Vercel (React)

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                   Vercel Frontend (React)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Pages: Workflows, Run, Health Dashboard          │   │
│  │ Components: WorkflowList, RunExecutor, StatusUI  │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS Calls
                   ▼
┌─────────────────────────────────────────────────────────┐
│           Render Backend (Node.js/Express)              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes:                                          │   │
│  │ - /api/workflows (CRUD)                         │   │
│  │ - /api/runs (execute, list history)             │   │
│  │ - /health (status check)                        │   │
│  │ - /api/diagnostic (debug Gemini API)            │   │
│  └──────────────────────────────────────────────────┘   │
│                      │                                   │
│  ┌────────────┬──────┴──────┬─────────────┐             │
│  ▼            ▼             ▼             ▼             │
│ MongoDB    Gemini API   Environment   Request Logging   │
└─────────────────────────────────────────────────────────┘
```

### Data Models

**Workflow:**
```javascript
{
  _id: ObjectId,
  name: String,           // e.g., "News Processor"
  steps: [String],        // e.g., ["clean", "summarize", "tag"]
  createdAt: Date
}
```

**Run:**
```javascript
{
  _id: ObjectId,
  workflowId: ObjectId,   // Reference to Workflow
  workflowName: String,
  input: String,          // Original user input
  steps: [String],        // Steps executed
  outputs: [String],      // Output after each step
  createdAt: Date
}
```

---

## 📦 Prerequisites

- **Node.js:** v16+ (check with `node --version`)
- **npm:** v8+ (included with Node.js)
- **MongoDB:** Cloud account (MongoDB Atlas) or local instance
- **Google Gemini API Key:** Free from https://aistudio.google.com/app/apikey
- **Git:** For version control

### Verify Prerequisites

```bash
node --version    # Should be v16+
npm --version     # Should be v8+
git --version     # Should be installed
```

---

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aarya-Shinde/Workflow-Builder.git
cd Workflow-Builder
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
echo "MONGODB_URI=your_mongo_url
GEMINI_API_KEY=your_gemini_key
PORT=5000" > .env

# Start the backend server
npm start
# Server runs at http://localhost:5000
```

### 3. Frontend Setup (in another terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Start the dev server
npm run dev
# Frontend runs at http://localhost:5173
```

### 4. Access the Application

Open your browser and visit: **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend (.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workflow-builder?retryWrites=true&w=majority

# Google Gemini API
GEMINI_API_KEY=your-api-key-from-aistudio.google.com

# Server
PORT=5000
NODE_ENV=development
```

**Getting Your Keys:**

1. **MongoDB URI:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create/log into your cluster
   - Click "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and database name

2. **Gemini API Key:**
   - Visit https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key (free for students!)
   - **Never commit this to Git!**

### Frontend (.env.local)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

**For Production (Vercel):** Use your Render backend URL instead:
```env
VITE_API_URL=https://workflow-builder-hzft.onrender.com
```

### Important Security Notes

- ✅ Add `.env` to `.gitignore` to prevent accidental commits
- ✅ Never share your API keys publicly
- ✅ Use environment variables for all sensitive data
- ✅ Regenerate API keys if they're ever exposed

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Create Render Service:**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Add Environment Variables:**
   - In Render dashboard, go to "Environment"
   - Add `MONGODB_URI` and `GEMINI_API_KEY`
   - Render will auto-deploy on push

4. **Access Backend:**
   - Your backend URL: `https://workflow-builder-hzft.onrender.com`

### Frontend Deployment (Vercel)

1. **Push code to GitHub**

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Set root directory to `frontend/`
   - Add `VITE_API_URL` environment variable

3. **Vercel automatically:**
   - Builds your React app
   - Optimizes for production
   - Deploys on every push
   - Provides free HTTPS/CDN

### Cold Start Issue (Important!)

Render's free tier puts services to sleep after 15 minutes of inactivity. First request takes ~30 seconds.

**Solution:** Use a service like https://koyeb.com or upgrade to Render's paid tier.

---

## 📡 API Endpoints

### Workflows

**GET /api/workflows**
- Get all workflows
- Response: `[{ _id, name, steps, createdAt }]`

**POST /api/workflows**
- Create new workflow
- Body: `{ name: "string", steps: ["clean", "summarize"] }`
- Response: `{ _id, name, steps }`

**PUT /api/workflows/:id**
- Update workflow
- Body: `{ name: "string", steps: [...] }`

**DELETE /api/workflows/:id**
- Delete workflow

### Runs

**POST /api/runs/execute**
- Execute a workflow
- Body: `{ workflowId: "string", input: "text to process" }`
- Response: `{ run: { _id, workflowName, input, outputs } }`

**GET /api/runs**
- Get last 5 run executions
- Response: `[{ _id, workflowName, input, outputs, createdAt }]`

### Health Check

**GET /health**
- Check system status
- Response: `{ backend: "ok", mongodb: "ok", llm: "ok" }`

### Diagnostic

**GET /api/diagnostic/test-gemini**
- Test Gemini API connection
- Shows available models and test execution
- Response: `{ status: "success", availableModels, testedModel, testResult }`

---

## 🐛 Troubleshooting

### "Gemini API Error: models/gemini-2.5-flash not found"

**Cause:** Wrong API key or model not available in your plan

**Fix:**
1. Verify API key in Render environment variables
2. Visit `/api/diagnostic/test-gemini` to check available models
3. Update model name in `routes/health.js` and `routes/runs.js` if needed

### MongoDB Connection Refused

**Cause:** Invalid connection string or IP whitelist issue

**Fix:**
1. Check MongoDB URI is correct
2. In MongoDB Atlas, add your IP to whitelist (or allow all: 0.0.0.0/0)
3. Ensure password has no special characters (or URL-encode them)

### Frontend Can't Connect to Backend

**Cause:** Wrong API URL or CORS issue

**Fix:**
1. Check `VITE_API_URL` matches your backend URL
2. Ensure backend has CORS enabled: `app.use(cors())`
3. In browser DevTools, check Network tab for actual request URL

### "API key was reported as leaked"

**Cause:** API key exposed in GitHub history

**Fix:**
1. Generate new API key from https://aistudio.google.com/app/apikey
2. Remove old key from Render environment variables
3. Add new key to Render
4. Clean Git history: `git rm --cached .env` and push

---

## 📚 Workflow Examples

### Example 1: News Article Processor

**Steps:** `["clean", "summarize", "tag"]`

- Input: Raw news article with extra whitespace
- Step 1: Clean text and fix grammar
- Step 2: Summarize to 5 key lines
- Step 3: Auto-categorize (Tech, Finance, Health, etc.)

### Example 2: Customer Feedback Analyzer

**Steps:** `["clean", "tag", "keypoints"]`

- Input: Customer review
- Step 1: Clean and normalize text
- Step 2: Categorize feedback type
- Step 3: Extract key complaints/praise

---

---


## 🚀 Next Steps / Future Enhancements

- [ ] Add user authentication (JWT)
- [ ] Store workflows in user accounts
- [ ] Add workflow scheduling
- [ ] Support more AI models (Claude, OpenAI)
- [ ] Batch processing for multiple inputs
- [ ] Workflow templates library
- [ ] Custom Python/JS step execution
- [ ] Webhook integration for automation

---
