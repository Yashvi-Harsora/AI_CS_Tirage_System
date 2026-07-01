# 📁 Project Structure

```text
TriageAI/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MessageForm.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SingleAnalysis.jsx
│   │   │   └── BulkAnalysis.jsx
│   │   │
│   │   ├── services/
│   │   │   └── triageApi.js
│   │   │
│   │   ├── styles/
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   └── index.js
│   │   │
│   │   ├── controllers/
│   │   │   └── triageController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── cors.js
│   │   │   ├── errorHandler.js
│   │   │   └── validateRequest.js
│   │   │
│   │   ├── pipeline/
│   │   │   │
│   │   │   ├── stages/
│   │   │   │   ├── inputValidation.js
│   │   │   │   ├── normalizeMessage.js
│   │   │   │   ├── aiAnalysis.js
│   │   │   │   ├── validateAIResponse.js
│   │   │   │   └── businessRules.js
│   │   │   │
│   │   │   └── triagePipeline.js
│   │   │
│   │   ├── prompts/
│   │   │   └── triagePrompt.js
│   │   │
│   │   ├── routes/
│   │   │   └── triageRoutes.js
│   │   │
│   │   ├── services/
│   │   │   └── geminiService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── AppError.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env.example
│
├── README.md
└── LICENSE
```

---

# 🏗 Backend Processing Pipeline

```text
               Customer Message
                      │
                      ▼
           Input Validation Stage
                      │
                      ▼
         Message Normalization Stage
                      │
                      ▼
            Prompt Construction
                      │
                      ▼
              Google Gemini AI
                      │
                      ▼
          AI Response Validation
                      │
                      ▼
          Business Rule Engine
                      │
                      ▼
          Final JSON API Response
```

---

# 💻 Frontend Flow

```text
Customer
    │
    ▼
React Dashboard
    │
    ▼
Message Form
    │
    ▼
Axios API Call
    │
    ▼
Express Backend
    │
    ▼
AI Processing Pipeline
    │
    ▼
JSON Response
    │
    ▼
Result Dashboard
```

---

# 🧠 AI Decision Pipeline

```text
Customer Message
        │
        ▼
Intent Detection
        │
        ▼
Category Classification
        │
        ▼
Priority Prediction
        │
        ▼
Sentiment Analysis
        │
        ▼
Entity Extraction
        │
        ▼
Confidence Estimation
        │
        ▼
Business Rule Engine
        │
        ▼
Human Review Decision
        │
        ▼
Final Triage Report
```

---

# ⚙ Business Rule Flow

```text
AI Response
      │
      ▼
Critical Priority?
      │
      ├── Yes → Auto Escalation
      │
      ▼
Billing + Angry?
      │
      ├── Yes → Churn Risk
      │
      ▼
Needs Previous Records?
      │
      ├── Yes → Human Review
      │
      ▼
Prompt Injection?
      │
      ├── Yes → Manual Review
      │
      ▼
Multi-Issue?
      │
      ├── Yes → Human Review
      │
      ▼
Assign Department
      │
      ▼
Assign SLA
      │
      ▼
Return Final Report
```

## 📌 High Level Architecture

Frontend (React)
│
▼
REST API (Express.js)
│
▼
Pipe-and-Filter Pipeline
│
▼
Google Gemini AI
│
▼
Business Rule Engine
│
▼
Structured Triage Report
