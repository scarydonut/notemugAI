import express from "express";
import Note from "../models/Note.js";
import axios from "axios";
const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();

    res.status(201).json({
      message: "Note saved successfully.",
      savedNoteId: savedNote._id,
    });
  } catch (err) {
    console.error("Error saving note:", err);
    res.status(500).json({ error: "Failed to save note." });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted." });
  } catch (err) {
    res.status(500).json({ error: "Delete failed." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: "Update failed." });
  }
});

router.post("/extract-keywords", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return res.status(400).json({ error: "Invalid or empty text provided." });
  }

  try {
    const response = await axios.post("https://keyword-yudi.onrender.com/extract", { text });
    if (!response.data?.keywords || !response.data?.suggestions) {
      return res.status(500).json({ error: "Invalid response from keyword API." });
    }
    console.log("✅ Keyword extraction success:", response.data);

    res.json({
      keywords: response.data.keywords,
      suggestions: response.data.suggestions,
    });
  } catch (err) {
    console.error("❌ Keyword extraction error:", err.response?.data || err.message);
    res.status(500).json({ error: "Keyword extraction failed." });
  }
});

