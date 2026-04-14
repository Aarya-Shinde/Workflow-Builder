# Workflow Builder

A powerful, modular text processing application that lets you chain multiple AI-powered transformations together. Built with Node.js/Express backend, React frontend, and Google Gemini AI.

**Live Demo:** https://workflow-builder-hzft.onrender.com (Render backend) + Vercel frontend

---

## 📋 Table of Contents

- [Features](#features)
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Configuration](#configuration)
- [How to Run](#how-to-run)
- [API Endpoints](#api-endpoints)
- [Functions and Features](#functions-and-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

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

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js v16+
- **Framework:** Express.js v5.2.1
- **Database:** MongoDB (Atlas) with Mongoose ODM
- **AI Integration:** Google Gemini AI API (v1beta)
- **HTTP Client:** Axios v1.13.5
- **CORS:** cors v2.8.6
- **Environment:** dotenv v17.3.1

### Frontend
- **Framework:** React 19.2.0 with Vite 7.3.1
- **Styling:** Tailwind CSS v4.2.1
- **Routing:** React Router DOM v7.13.1
- **HTTP Client:** Axios v1.13.5
- **Build Tool:** Vite with @vitejs/plugin-react
- **Linting:** ESLint with React plugins

### Deployment
- **Backend:** Render (Node.js hosting)
- **Frontend:** Vercel (React hosting)
- **Database:** MongoDB Atlas

---

## 🎯 Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                   Vercel Frontend (React)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Pages: Builder, Run, History, Health             │   │
│  │ Components: Workflow forms, Run executor, Lists │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS Calls
                   ▼
┌─────────────────────────────────────────────────────────┐
│           Render Backend (Node.js/Express)              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes:                                          │   │
│  │ - /api/workflows (CRUD operations)              │   │
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
  steps: [String],        // e.g., ["clean", "summarize", "keypoints", "tag"]
  createdAt: Date,
  updatedAt: Date
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
  createdAt: Date,
  updatedAt: Date
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

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aarya-Shinde/Workflow-Builder.git
cd Workflow-Builder
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workflow-builder?retryWrites=true&w=majority

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional, defaults to 5000)
PORT=5000
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-render-app.onrender.com`).

---

## ▶️ How to Run

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Backend will run at `http://localhost:5000`

2. **Start Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run at `http://localhost:5173`

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

### Production Build

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

---

## 🔌 API Endpoints

### Workflows
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create a new workflow
- `DELETE /api/workflows/:id` - Delete a workflow

### Runs
- `GET /api/runs` - List all runs (history)
- `POST /api/runs/execute` - Execute a workflow

### Health & Diagnostics
- `GET /health` - Backend health check
- `GET /api/diagnostic` - Test Gemini API connection

---

## 🎨 Functions and Features

### Builder Page
- **Create Workflows:** Enter a name and select up to 4 processing steps from:
  - **Clean Text:** Removes extra whitespace, fixes grammar, and improves readability
  - **Summarize:** Condenses the text into key points
  - **Extract Key Points:** Converts content into bullet-point format
  - **Tag Category:** Automatically categorizes into one of 5 categories (Technology, Business, Health, Education, Entertainment)
- **Validation:** Requires at least 2 steps and a non-empty name
- **Manage Workflows:** View existing workflows and delete them

### Run Page
- **Select Workflow:** Choose from saved workflows
- **Input Text:** Enter the text to process
- **Execute:** Run the workflow and see step-by-step outputs
- **Results Display:** Shows original input, each step's transformation, and final output

### History Page
- **View Past Runs:** List of all executed workflows with timestamps
- **Details:** Click to see full input, steps, and outputs for each run

### Health Page
- **Backend Status:** Check if the server is running
- **Database Connection:** Verify MongoDB connectivity
- **API Status:** Test Gemini AI API availability

---

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add `VITE_API_URL` environment variable pointing to Render backend
5. Deploy

### Database (MongoDB Atlas)
- Create a free cluster
- Get connection string
- Whitelist IP addresses or use 0.0.0.0/0 for testing
- Add to backend environment variables

---

## 🔧 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 5000 is available
- Verify MongoDB URI is correct
- Ensure all dependencies are installed

**Frontend can't connect to backend:**
- Check if backend is running
- Verify `VITE_API_URL` in `.env.local`
- Check CORS settings

**Gemini API errors:**
- Verify API key is valid
- Check API quota limits
- Ensure internet connection

**Database connection fails:**
- Check MongoDB Atlas credentials
- Verify network access
- Check firewall settings

### Logs
- Backend logs appear in terminal/console
- Check browser developer tools for frontend errors
- Use `/health` endpoint for backend diagnostics

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add feature'`
6. Push: `git push origin feature-name`
7. Create a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

For more information or support, please open an issue on GitHub.
# Workflow Builder

A powerful, modular text processing application that lets you chain multiple AI-powered transformations together. Built with Node.js/Express backend, React frontend, and Google Gemini AI.

**Live Demo:** https://workflow-builder-hzft.onrender.com (Render backend) + Vercel frontend

---

##  Table of Contents

- [Features](#features)
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Configuration](#configuration)
- [How to Run](#how-to-run)
- [API Endpoints](#api-endpoints)
- [Functions and Features](#functions-and-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

##  Features

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

##  Project Overview

**Workflow Builder** is a full-stack application that demonstrates:
- Backend API design with Express.js
- MongoDB data persistence
- Integration with Google Gemini API
- Frontend-backend communication patterns
- Production-ready deployment on Render + Vercel

The core concept: Users define a sequence of text transformation steps, then execute them on input text. Each step's output becomes the next step's input, creating a pipeline.

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js v16+
- **Framework:** Express.js v5.2.1
- **Database:** MongoDB (Atlas) with Mongoose ODM
- **AI Integration:** Google Gemini AI API (v1beta)
- **HTTP Client:** Axios v1.13.5
- **CORS:** cors v2.8.6
- **Environment:** dotenv v17.3.1

### Frontend
- **Framework:** React 19.2.0 with Vite 7.3.1
- **Styling:** Tailwind CSS v4.2.1
- **Routing:** React Router DOM v7.13.1
- **HTTP Client:** Axios v1.13.5
- **Build Tool:** Vite with @vitejs/plugin-react
- **Linting:** ESLint with React plugins

### Deployment
- **Backend:** Render (Node.js hosting)
- **Frontend:** Vercel (React hosting)
- **Database:** MongoDB Atlas

---

##  Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                   Vercel Frontend (React)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Pages: Builder, Run, History, Health             │   │
│  │ Components: Workflow forms, Run executor, Lists │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS Calls
                   ▼
┌─────────────────────────────────────────────────────────┐
│           Render Backend (Node.js/Express)              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Routes:                                          │   │
│  │ - /api/workflows (CRUD operations)              │   │
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
  steps: [String],        // e.g., ["clean", "summarize", "keypoints", "tag"]
  createdAt: Date,
  updatedAt: Date
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
  createdAt: Date,
  updatedAt: Date
}
```

---

##  Prerequisites

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

##  Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aarya-Shinde/Workflow-Builder.git
cd Workflow-Builder
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workflow-builder?retryWrites=true&w=majority

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional, defaults to 5000)
PORT=5000
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-render-app.onrender.com`).

---

##  How to Run

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Backend will run at `http://localhost:5000`

2. **Start Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run at `http://localhost:5173`

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

### Production Build

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

---

## 🔌 API Endpoints

### Workflows
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create a new workflow
- `DELETE /api/workflows/:id` - Delete a workflow

### Runs
- `GET /api/runs` - List all runs (history)
- `POST /api/runs/execute` - Execute a workflow

### Health & Diagnostics
- `GET /health` - Backend health check
- `GET /api/diagnostic` - Test Gemini API connection

---

##  Functions and Features

### Builder Page
- **Create Workflows:** Enter a name and select up to 4 processing steps from:
  - **Clean Text:** Removes extra whitespace, fixes grammar, and improves readability
  - **Summarize:** Condenses the text into key points
  - **Extract Key Points:** Converts content into bullet-point format
  - **Tag Category:** Automatically categorizes into one of 5 categories (Technology, Business, Health, Education, Entertainment)
- **Validation:** Requires at least 2 steps and a non-empty name
- **Manage Workflows:** View existing workflows and delete them

### Run Page
- **Select Workflow:** Choose from saved workflows
- **Input Text:** Enter the text to process
- **Execute:** Run the workflow and see step-by-step outputs
- **Results Display:** Shows original input, each step's transformation, and final output

### History Page
- **View Past Runs:** List of all executed workflows with timestamps
- **Details:** Click to see full input, steps, and outputs for each run

### Health Page
- **Backend Status:** Check if the server is running
- **Database Connection:** Verify MongoDB connectivity
- **API Status:** Test Gemini AI API availability

---

##  Deployment

### Backend (Render)
1. Connect your GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add `VITE_API_URL` environment variable pointing to Render backend
5. Deploy

### Database (MongoDB Atlas)
- Create a free cluster
- Get connection string
- Whitelist IP addresses or use 0.0.0.0/0 for testing
- Add to backend environment variables

---

##  Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 5000 is available
- Verify MongoDB URI is correct
- Ensure all dependencies are installed

**Frontend can't connect to backend:**
- Check if backend is running
- Verify `VITE_API_URL` in `.env.local`
- Check CORS settings

**Gemini API errors:**
- Verify API key is valid
- Check API quota limits
- Ensure internet connection

**Database connection fails:**
- Check MongoDB Atlas credentials
- Verify network access
- Check firewall settings

### Logs
- Backend logs appear in terminal/console
- Check browser developer tools for frontend errors
- Use `/health` endpoint for backend diagnostics

---

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add feature'`
6. Push: `git push origin feature-name`
7. Create a Pull Request

---

##  License


---

For more information or support, please open an issue on GitHub.
