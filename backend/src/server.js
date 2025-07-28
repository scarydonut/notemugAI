import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/noteRoutes.js";
import aiRoutes from "./routes/ai.js";
import pdfRoutes from "./routes/pdfRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("NoteGenius API Running"));
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/pdf", pdfRoutes);
const PORT = process.env.PORT || 5001;
connectDB();
app.listen (PORT, () =>{
    console.log('Server is running on port',PORT);
})