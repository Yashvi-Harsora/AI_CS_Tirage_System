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

---

📌 What this project does

This system takes a user’s message and understands what it means.
It doesn’t just read words — it tries to understand emotion, intent, and context behind the message.
For example, it can tell if a message is a question, complaint, friendly talk, or something negative.

🧩 Model + Tools Used

We used a large language model (LLM) as the main brain of the system.

Instead of training a new AI model from scratch, we used a pre-trained AI model and guided it with smart instructions (prompts).

The system may also use:

Message input handler (to receive user text)
Prompt engine (to structure input before sending to AI)
Response parser (to clean and organize AI output)
🧭 Prompt Strategy (How AI is guided)

We don’t just send raw text to AI.

We give it a clear instruction like:

What role it should play (e.g., “You are a message analyst”)
What to look for (sentiment, intent, tone)
What format to respond in (structured and clean output)

We also break the task into small parts so the AI doesn’t get confused.

⚠️ Handling Uncertainty

Sometimes messages are unclear or mixed.

In those cases:

AI is told to not guess strongly
It gives a best possible label + confidence level
If something is unclear, it marks it as “uncertain” instead of forcing an answer

This prevents wrong or misleading results.

🧹 Handling Bad or Noisy Input

Users may send:

short messages like “ok”
slang or emojis only
incomplete sentences
spam-like text

To handle this:

system first normalizes text (understands slang/emojis in context)
filters out meaningless input when needed
still tries to extract basic intent if possible
✅ How we know it works

We test the system using:

normal real-world messages (chat-style data)
emotional messages (angry, happy, sarcastic)
unclear or broken sentences

We check:

Is sentiment correct?
Is intent logical?
Does output match human understanding?

If results match human judgment most of the time → system is considered working well.

🔧 What we improve with more time

If we improve this system further, we would:

make sentiment detection more accurate for sarcasm
improve understanding of Hinglish + slang (important for Indian users)
add better confidence scoring
reduce wrong interpretation in short messages
add memory for conversation context (multi-message understanding)
