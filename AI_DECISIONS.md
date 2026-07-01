📌 What this project does

This system takes a user’s message and understands its meaning beyond just words.

It detects:

Emotion (sentiment) → positive / negative / neutral
Intent → question, complaint, request, etc.
Tone → polite, rude, angry, friendly, etc.

👉 Goal: Understand human communication the way a human would, not just text matching.

🧩 Model + Tools Used

We use a pre-trained Large Language Model (LLM) as the core intelligence.

Instead of training our own model, we:

Use an existing powerful AI model
Guide it using structured instructions (prompts)
Supporting components:
Input Handler → receives user messages
Prompt Engine → formats message before sending to AI
Response Parser → cleans and organizes AI output
🧭 Prompt Strategy (How AI is guided)

We don’t send raw text directly.

Instead, we clearly instruct the AI:

✔ What role it has (e.g., “You are a message analyzer”)
✔ What to extract (sentiment, intent, tone)
✔ How to respond (structured and clean output)

We also:

Break tasks into smaller steps
Keep instructions simple and consistent
Reduce confusion by avoiding mixed instructions
⚠️ Handling Uncertainty

Not all messages are clear.

So the system is designed to:

Avoid forcing a wrong answer
Provide a best guess with confidence level
Mark results as “uncertain” when needed

👉 This helps prevent misleading outputs.

🧹 Handling Bad or Noisy Input

Users often send messy or unclear messages like:

“ok”
emojis only 😊🔥
slang / Hinglish
incomplete sentences

We handle this by:

Understanding slang + informal language
Interpreting emojis as emotion signals
Ignoring meaningless noise when necessary
Still trying to extract basic intent if possible
✅ How we know it works

We test the system using real-world scenarios:

Normal chat messages
Emotional conversations (angry, happy, sad)
Sarcasm and tricky sentences
Short / unclear inputs
We check:
Does sentiment match human judgment?
Is intent correctly identified?
Is output logically consistent?

👉 If results match human interpretation most of the time, the system is considered successful.

🔧 What we improve with more time

If we further improve this project, we can:

Improve sarcasm detection
Better support for Hinglish + slang
Add stronger confidence scoring
Reduce mistakes in very short messages
Add conversation memory (context tracking)
