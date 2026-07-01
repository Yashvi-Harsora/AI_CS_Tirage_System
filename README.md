# 🤖 TriageAI – Intelligent Customer Support Ticket Triage System

TriageAI is an AI-powered customer support triage system that automatically analyzes customer messages, classifies issues, assigns priorities, detects sentiment, recommends actions, and determines when human intervention is required.

The project combines Large Language Models (Google Gemini) with deterministic business rules using a Pipe-and-Filter architecture to build a reliable and explainable AI system.

---

# 🚀 Features

- AI-powered customer message analysis
- Automatic issue categorization
- Priority scoring (0–100)
- Sentiment analysis
- Department routing
- SLA target assignment
- Human escalation detection
- Prompt injection detection
- Business rule engine
- Structured JSON responses
- Modern React Dashboard
- Single & Bulk Message Analysis

---

# 🏗 Architecture

The application follows a **Pipe-and-Filter Architecture** where each stage has a single responsibility.

```
Client Request
      │
      ▼
Input Validation
      │
      ▼
Normalization
      │
      ▼
Prompt Builder
      │
      ▼
Gemini AI Analysis
      │
      ▼
Response Validation
      │
      ▼
Business Rules Engine
      │
      ▼
Final Response
```

---

# 🧠 AI Workflow

1. Customer submits a message.
2. Backend validates input.
3. Prompt is generated dynamically.
4. Gemini analyzes the message.
5. JSON response is validated.
6. Business Rules modify the AI output.
7. Final triage report is returned.

---

# ⚙ Business Rules

The AI output is enhanced using deterministic business rules.

Implemented Rules:

- Critical issues → Auto escalation
- Angry Billing Customer → Churn Risk Detection
- SLA Assignment
- Department Routing
- Low Confidence Detection
- Human Escalation
- Prompt Injection Detection
- Multi-Issue Detection

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Axios
- CSS

## Backend

- Node.js
- Express.js

## AI

- Google Gemini API

---

# 📁 Project Structure

```
TriageAI/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── pipeline/
│   ├── prompts/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

# 📊 Output

The AI returns:

- Summary
- Category
- Sub Category
- Priority
- Priority Score
- Sentiment
- Confidence
- Suggested Department
- SLA Target
- Estimated Resolution Time
- Recommended Actions
- Extracted Entities
- Tags

---

# 🛡 AI Safety

The system includes:

- Prompt Injection Detection
- Response Validation
- Business Rule Enforcement
- Human Escalation
- Confidence Scoring

These safeguards ensure that AI recommendations remain reliable and explainable.

---

# ▶ Installation

## Clone

```bash
git clone <repository-url>
```

---

## Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_API_KEY
GEMINI_MODEL=gemini-2.0-flash
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🌐 API Endpoints

## Analyze Single Message

```
POST /api/analyze
```

---

## Analyze Bulk Messages

```
POST /api/analyze/bulk
```

---

## Health Check

```
GET /health
```

---

# 🎯 Example Use Cases

- Refund Requests
- Payment Failures
- Login Issues
- Shipping Delays
- Technical Bugs
- Account Access Problems

---

# 👥 Team

Hackathon Submission

Developed using:

- React
- Express.js
- Google Gemini
- Pipe-and-Filter Architecture
- Business Rule Engine

---

# 📄 License

This project was developed for educational and hackathon purposes.
