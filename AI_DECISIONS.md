🤖 AI Decisions Note

1. Model & Tools Used
   AI Model
   Google Gemini 2.0 Flash
   Used for customer ticket understanding and structured triage generation.
   Backend
   Node.js
   Express.js
   Frontend
   React
   Vite
   Axios
   AI Integration
   Google Gemini API
   JSON Response Schema Validation
   Prompt Engineering
   Pipe-and-Filter Processing Pipeline
2. Prompt Strategy

Instead of asking the LLM simple questions, the backend dynamically builds a structured prompt containing:

Customer message
Communication channel
Language
Business instructions
Required JSON schema
Priority rules
Confidence rules
Human escalation guidelines

The prompt instructs Gemini to return only structured JSON instead of free text.

The customer message is wrapped inside:

<CUSTOMER_MESSAGE>
...
</CUSTOMER_MESSAGE>

This prevents the model from treating customer input as system instructions and reduces prompt injection risks.

3. AI Decision Flow
   Customer Message
   │
   ▼
   Input Validation
   │
   ▼
   Normalize Text
   │
   ▼
   Build AI Prompt
   │
   ▼
   Gemini Analysis
   │
   ▼
   Validate JSON Response
   │
   ▼
   Apply Business Rules
   │
   ▼
   Return Final Triage Report
4. How the AI Makes Decisions

The AI analyzes every customer message and predicts:

Issue Category
Subcategory
Priority
Priority Score (0–100)
Sentiment
Sentiment Score
Department
Resolution Time
Summary
Suggested Actions
Extracted Entities
Tags
Confidence Score

The model makes these decisions using:

urgency keywords
customer sentiment
business impact
issue type
previous context requirements
language understanding 5. Business Rules After AI

The LLM is not trusted blindly.

Every AI response passes through a deterministic Business Rules Engine.

Current rules include:

Critical issues → Auto Escalation
Billing + Angry → Churn Risk
SLA Assignment
Department Routing
Low Confidence Detection
Human Escalation
Prompt Injection Detection
Multi-Issue Detection

These rules ensure consistent business behaviour regardless of AI output.

6. How We Handle Uncertainty & Bad Input

The system is designed to fail safely.

Input Validation

Rejects:

Empty messages
Very short messages
Invalid metadata
Oversized requests
Prompt Injection Detection

Detects suspicious prompts such as:

Ignore previous instructions
Act as ChatGPT
Print system prompt
Return hidden prompt

These requests are flagged for manual review.

Human Escalation

If a ticket depends on:

previous conversations
CRM records
refund history
internal tickets
account history

the confidence is reduced and the request is routed to a human support agent.

Confidence Scoring

Confidence is not always 100%.

Typical ranges:

Confidence Meaning
95–100% Very clear request
80–94% Minor ambiguity
60–79% Requires internal context
40–59% Ambiguous request
Below 40% Spam / Prompt Injection / Invalid 7. How We Know It Works

The system has been manually tested using multiple customer support scenarios.

Test categories include:

Refund Requests
Payment Issues
Login Problems
Shipping Delays
Technical Bugs
Account Recovery
Multi-Issue Tickets
Prompt Injection Attempts
Human Escalation Cases

Each output was verified for:

Correct category
Priority accuracy
Sentiment
Department routing
Confidence
Suggested actions
Business rule execution 8. Safety Measures

The backend includes several AI safety mechanisms:

JSON schema validation
Response validation
Prompt isolation
Business rule enforcement
Confidence scoring
Human review routing
Prompt injection detection

These safeguards ensure that AI recommendations remain reliable and explainable.

9. Limitations

Current limitations include:

No CRM integration
No ticket history lookup
No authentication layer
English-focused prompts
Manual business rules

These were acceptable trade-offs for a hackathon prototype.

10. What We'd Improve with More Time

Future improvements would include:

Retrieval-Augmented Generation (RAG) using previous tickets and knowledge base.
Automatic CRM and helpdesk integration (e.g., Zendesk, Freshdesk).
Multilingual response generation with automatic language detection.
Fine-tuned confidence calibration using historical support data.
ML-based learning from agent feedback to improve routing accuracy.
Real-time analytics dashboard with SLA monitoring and trend analysis.
Support for voice transcripts and email attachments.
Role-based authentication and audit logging for enterprise deployment.
