📁 Backend Folder Structure
backend/
│
├── config/
│ ├── index.js # Environment configuration
│
├── controllers/
│ └── triageController.js # API request handlers
│
├── middleware/
│ ├── cors.js # CORS configuration
│ ├── errorHandler.js # Centralized error handling
│ └── validateRequest.js # HTTP validation
│
├── pipeline/
│ ├── stages/
│ │ ├── inputValidation.js
│ │ ├── normalizeMessage.js
│ │ ├── aiAnalysis.js
│ │ ├── validateAIResponse.js
│ │ └── businessRules.js
│ │
│ └── triagePipeline.js # Pipeline orchestrator
│
├── prompts/
│ └── triagePrompt.js # Gemini prompt builder
│
├── routes/
│ └── triageRoutes.js
│
├── services/
│ └── geminiService.js # Google Gemini integration
│
├── utils/
│ ├── logger.js
│ └── AppError.js
│
├── server.js
└── package.json
🏛 Architectural Decisions
Why Pipe-and-Filter instead of MVC?

This project intentionally follows a Pipe-and-Filter Architecture instead of MVC because the application behaves as a processing pipeline rather than a CRUD application.

Unlike traditional MVC systems:

No persistent database is required.
No Models are needed.
No server-side Views are rendered.
Each request is processed independently and returned immediately.

Every customer message passes through multiple independent processing stages before the final response is generated.

Customer Message
│
▼
Input Validation
│
▼
Message Normalization
│
▼
Prompt Builder
│
▼
Google Gemini AI
│
▼
Response Validation
│
▼
Business Rule Engine
│
▼
Final JSON Response

This design improves:

Maintainability
Scalability
Debugging
Reusability
Explainability
🤖 AI Decision Process
AI Model

Google Gemini 2.0 Flash

The LLM is responsible only for understanding customer messages.

It performs:

Intent Understanding
Category Classification
Priority Prediction
Sentiment Analysis
Entity Extraction
Action Recommendation

Business decisions are intentionally not left entirely to AI.

🧠 Prompt Engineering Strategy

The prompt instructs Gemini to always return structured JSON.

It contains:

Category rules
Priority guidelines
Sentiment definitions
Confidence guidelines
Entity extraction rules
Strict output format
Hallucination prevention rules

Customer messages are wrapped inside dedicated tags:

<CUSTOMER_MESSAGE>
...
</CUSTOMER_MESSAGE>

This helps separate user content from system instructions and reduces prompt injection risks.

⚙ Business Rule Engine

After AI generates its response, deterministic business rules are applied.

Implemented Rules:

Rule 1

Critical Priority

↓

Auto Escalation

Rule 2

Billing + Angry Customer

↓

Add Churn Risk Tag

Rule 3

Priority

↓

Assign SLA Target

Rule 4

Category

↓

Department Routing

Rule 5

Low AI Confidence

↓

Suggest Customer Clarification

Rule 6

Requires Previous Records

↓

Human Review Required

Confidence capped at 70%

Rule 7

Prompt Injection Detection

↓

Manual Review

Confidence reduced

Rule 8

Multiple Issues Detected

↓

Human Review

🛡 AI Safety

Several safeguards improve reliability:

Input Validation
AI Response Validation
Confidence Verification
Prompt Injection Detection
Human Escalation
Business Rule Enforcement

This ensures the system produces explainable and reliable recommendations instead of blindly trusting the LLM.

🔄 Decision Flow
Customer Message
│
▼
Validate Input
│
▼
Normalize Text
│
▼
Generate Prompt
│
▼
Google Gemini
│
▼
Receive JSON
│
▼
Validate Response
│
▼
Apply Business Rules
│
▼
Return Final Report
📊 Final Output

Each request returns:

Summary
Category
Sub Category
Priority
Priority Score
Sentiment
Confidence
Department
SLA Target
Estimated Resolution Time
Suggested Actions
Extracted Entities
Tags
Human Review Status
