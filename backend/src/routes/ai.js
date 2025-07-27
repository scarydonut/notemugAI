import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const HEADERS = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "http://localhost:5173",
  "X-Title": "NoteGenius AI",
};

router.post("/summarize", async (req, res) => {
  const { text } = req.body;

  try {
    if (!text) {
      return res.status(400).json({ error: "Text is required for summarization." });
    }

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes notes for studying." },
          { role: "user", content: `Summarize the following content:\n\n${text}` }
        ],
      },
      { headers: HEADERS }
    );

    const result = response.data.choices[0].message.content;
    res.json({ summary: result });
  } catch (error) {
    console.error("❌ AI error in /summarize:", error.message);

    if (error.response) {
      console.error("📦 Response Data:", error.response.data);
      console.error("📦 Status:", error.response.status);
      console.error("📦 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("📡 No response received:", error.request);
    } else {
      console.error("🔥 Unexpected Error:", error.message);
    }

    res.status(500).json({ error: "Failed to summarize." });
  }
});

router.post("/quiz", async (req, res) => {
  const { text } = req.body;

  try {
    if (!text) {
      return res.status(400).json({ error: "Text is required for quiz generation." });
    }

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You generate MCQ quizzes from study notes." },
          { role: "user", content: `Generate 10 multiple choice questions based on the following notes:\n\n${text}` }
        ],
      },
      { headers: HEADERS }
    );

    const result = response.data.choices[0].message.content;
    res.json({ quiz: result });
  } catch (error) {
    console.error("❌ AI error in /quiz:", error.message);

    if (error.response) {
      console.error("📦 Response Data:", error.response.data);
      console.error("📦 Status:", error.response.status);
      console.error("📦 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("📡 No response received:", error.request);
    } else {
      console.error("🔥 Unexpected Error:", error.message);
    }

    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

router.post("/define", async (req, res) => {
  const { phrase } = req.body;
  try {
    const systemPrompt = `Explain the term or phrase "${phrase}" in simple words like you're talking to a school student. Keep it short and beginner-friendly.`;

    const completionRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: systemPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const explanation = completionRes.data.choices[0].message.content;
    res.json({ explanation });
  } catch (err) {
    console.error("❌ Explain error:", err.message);
    res.status(500).json({ error: "Failed to fetch explanation." });
  }
});

export default router;
