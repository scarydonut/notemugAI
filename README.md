# NoteMug AI

NoteMug AI is a smart, browser-based note-taking assistant that lets you upload PDFs, generate summaries, create flashcards, and extract keywords with AI. Designed for students and professionals, it helps you digest and retain information efficiently.

## Features

- 📄 **PDF Upload:** Upload lecture slides, research papers, or any document in PDF format.
- ✨ **AI Summarization:** Automatically summarizes the content into concise notes.
- 🎯 **Flashcard Generation:** Generates Q&A flashcards from your document for easy revision.
- 🔑 **Keyword Extraction:** Highlights key terms and concepts with Wikipedia suggestions.
- 🧠 **Smart Note Saving:** Notes are stored securely in a MongoDB database and can be retrieved anytime.
- ✅ **Authentication:** Google login via OAuth keeps your notes private and personalized.
- 💻 **Beautiful UI:** Built with Vite, React, and ShadCN UI for a sleek, responsive experience.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB
- Python 3.10+ (for the keyword extraction microservice)
- API keys (OpenRouter)
- Render account (optional, for deployment)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/notegenius-ai.git
   cd notegenius-ai


2. **Install dependencies for backend and frontend**
   ```sh
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in both frontend/ and backend/ directories:
   
   ```
   backend/.env
   MONGODB_URI=your_mongodb_connection_string
   OPENROUTER_API_KEY=your_openrouter_key
   FLASK_KEYWORD_API_URL=https://your-keyword-microservice-url/extract

   frontend/.env
   VITE_API_URL=http://localhost:5173
   ```

4. **Start the Python microservice:**
   ```sh
   cd backend/src/ai
   python keyword_service.py
   ```

5. **Start the backend server:**
   ```sh
   cd backend
   npm run dev
   ```
6. **Start the frontend server:**
   ```sh
   cd frontend
   npm run dev
   ```
7. **Visit the app at:**
   ```sh
   http://localhost:5173
   ```

## Usage

- Log in with Google to access your personalized dashboard.
- Paste notes, transcription and lectures notes and summarize it and generate quiz for the same.
- Upload a PDF to generate summaries, flashcards, and keywords.
- All notes are saved under "Your Smart Notes" and can be edited or deleted.
- Designed to help you study and revise smarter.

## Technologies Used
Frontend:
- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

Backend:
- [Node.js](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [OpenRouter AI](https://openrouter.ai/)

Python Microservice:
- [Flask](https://flask.palletsprojects.com/en/stable/)
- [Yake](https://pypi.org/project/yake/)

## Deployment

Frontend: Deploy on Vercel or Netlify.

Backend: Deploy on Render or Railway.

Python Service: Deploy as a separate web service on Render (Flask app with /extract route).

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

MIT

---

**Note:** This project is for educational/demo purposes. Use at your own risk.