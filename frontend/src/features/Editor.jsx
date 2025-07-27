import React, { useState, useEffect } from "react";
import axios from "axios";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import SummaryResult from "./SummaryResult";
import QuizResult from "./QuizResult";

const Editor = ({ user: propUser }) => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!propUser) {
      const stored = localStorage.getItem("notegenius-user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        window.location.href = "/login";
      }
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  const getUserId = () => {
    return user?._id || localStorage.getItem("userId");
  };

  const handleSummarize = async () => {
    setLoadingSummary(true);
    try {
      const res = await axios.post("http://localhost:5001/api/ai/summarize", { text });
      setSummary(res.data.summary);

      if (currentNoteId) {
        await axios.put(`http://localhost:5001/api/notes/${currentNoteId}`, {
          summary: res.data.summary,
        });
      } else {
        const saveRes = await axios.post("http://localhost:5001/api/notes/save", {
          userId: getUserId(),
          title: text.substring(0, 30),
          text,
          summary: res.data.summary,
          quiz: "",
        });

        setCurrentNoteId(saveRes.data.savedNoteId || saveRes.data._id);
      }
    } catch (err) {
      console.error("Summarize error:", err);
      alert("❌ Failed to summarize: " + err.message);
    }
    finally {
      setLoadingSummary(false);
    }
  };
  const handleQuiz = async () => {
    setLoadingQuiz(true);
    try {
      const res = await axios.post("http://localhost:5001/api/ai/quiz", { text });
      setQuiz(res.data.quiz);

      if (currentNoteId) {
        await axios.put(`http://localhost:5001/api/notes/${currentNoteId}`, {
          quiz: res.data.quiz,
        });
      } else {
        const saveRes = await axios.post("http://localhost:5001/api/notes/save", {
          userId: getUserId(),
          title: text.substring(0, 30),
          text,
          summary: "",
          quiz: res.data.quiz,
        });

        setCurrentNoteId(saveRes.data.savedNoteId || saveRes.data._id);
      }
    } catch (err) {
      console.error("Quiz error:", err);
      alert("❌ Failed to generate quiz: " + err.message);
    }
    finally {
      setLoadingQuiz(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-b from-blue-50 via-white to-green-50 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-6 text-center">🧠 NoteGenius Editor</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-indigo-700">📝 Write Your Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type or paste your class notes, book content, or lecture transcription..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <Button
          onClick={handleSummarize}
          disabled={loadingSummary}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {loadingSummary ? "Summarizing..." : "✨ Summarize"}
        </Button>

        <Button
          onClick={handleQuiz}
          disabled={loadingQuiz}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loadingQuiz ? "Generating Quiz..." : "🧠 Generate Quiz"}
        </Button>

        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigate("/upload-pdf")}
        >
          📤 Upload PDF Notes
        </Button>
        <Button
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
          onClick={() => navigate("/analyze-youtube")}
        >
          📺 YouTube Video Analysis
        </Button>

      </div>

      {loadingSummary ? (
        <Skeleton className="h-40 w-full rounded-lg bg-gray-200" />
      ) : (
        summary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-indigo-700">📘 Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <SummaryResult content={summary} />
            </CardContent>
          </Card>
        )
      )}

      {loadingQuiz ? (
        <Skeleton className="h-40 w-full rounded-lg bg-gray-200" />
      ) : (
        quiz && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">🎯 Quiz Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuizResult content={quiz} />
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default Editor;



