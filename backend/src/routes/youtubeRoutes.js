import express from "express";
import axios from "axios";
import Note from "../models/Note.js";
import { generateSummary, generateQuiz } from "../utils/ai.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  const { url, userId } = req.body;
  try {
    const ytTranscript = await axios.post("https://youtube-3456.onrender.com/transcribe", { url });
    const extractedText = ytTranscript.data.text;

    const [summary, quiz, keywordData] = await Promise.all([
      generateSummary(extractedText),
      generateQuiz(extractedText),
      axios.post("https://back-x6zy.onrender.com/api/notes/extract-keywords", { text: extractedText })
    ]);

    const { keywords, suggestions } = keywordData.data;

    const wikipediaLinks = suggestions.map(s => s.wikipedia);

    const note = await Note.create({
      userId,
      title: "YouTube Note - " + new Date().toLocaleString(),
      text: extractedText,
      summary,
      quiz,
      keywords,
      suggestions: wikipediaLinks,
    });

    res.json({ message: "Processed successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "YouTube processing failed" });
  }
});

export default router;
