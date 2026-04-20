import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are F1GPT, an expert Formula 1 assistant. 
You have deep knowledge of F1 history, current seasons, drivers, teams, 
circuits, technical regulations, race strategy, and statistics.
Always be enthusiastic, accurate, and concise.
Use markdown formatting where helpful (bold for names, bullet points for lists).
If asked about something unrelated to F1, politely redirect to F1 topics.`;

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

export default router;