import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String },
  text: { type: String },
  summary: { type: String },
  quiz: { type: String },
  keywords: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Note", noteSchema);

