import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const SYSTEM_PROMPT = `You are F1GPT, an expert Formula 1 assistant.
You have deep knowledge of F1 history, current seasons, drivers, teams,
circuits, technical regulations, race strategy, and statistics.

Key recent facts you know:
- The 2024 F1 World Championship was won by **Max Verstappen** (his 4th title), driving for Red Bull Racing
- The 2024 Constructors Championship was won by **McLaren**
- **Lewis Hamilton** moved to **Ferrari** for the 2025 season
- **Carlos Sainz** moved to **Williams** for 2025
- The 2025 season is currently underway

Always be enthusiastic, accurate, and concise.
Use markdown formatting where helpful (bold for names, bullet points for lists).
If asked about something unrelated to F1, politely redirect the conversation back to F1 topics.`;
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // ← moved inside

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Groq error:", error.message);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

export default router;