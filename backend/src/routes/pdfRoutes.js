import express from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import { upload } from "../middleware/upload.js";
import Note from "../models/Note.js";
import { generateSummary, generateQuiz } from "../utils/ai.js";
import axios from "axios";
const router = express.Router();

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;
    const keywordsRes = await axios.post("http://localhost:5001/api/notes/extract-keywords", { text: extractedText });
    const { keywords, suggestions } = keywordsRes.data;

    const summary = await generateSummary(extractedText);
    const quiz = await generateQuiz(extractedText);

    const savedNote = await Note.create({
      userId: req.body.userId,
      title: req.file.originalname,
      text: extractedText,
      summary,
      quiz,
      keywords,
      suggestions: suggestions.map(s => s.youtube).concat(suggestions.map(s => s.wikipedia)),
    });

    res.json({ message: "Success", note: savedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

export default router;
