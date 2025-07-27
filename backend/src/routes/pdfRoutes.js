import express from "express";
import fs from "fs";
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
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
    const dataBuffer = req.file.buffer;
    const pdf = await pdfjsLib.getDocument({ data: dataBuffer }).promise;
    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      extractedText += strings.join(" ") + "\n";
    }
    const keywordsRes = await axios.post("https://back-x6zy.onrender.com/api/notes/extract-keywords", { text: extractedText });
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
