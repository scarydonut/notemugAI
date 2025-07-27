import React, { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import SummaryResult from "../features/SummaryResult";
const YouTubeAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState(null);

  const user = JSON.parse(localStorage.getItem("notegenius-user"));
  const userId = user?._id || localStorage.getItem("userId");

  const handleAnalyze = async () => {
    if (!url.includes("youtube.com")) {
      alert("Please enter a valid YouTube link.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/youtube/analyze", {
        url,
        userId
      });

      setNote(res.data.note);
    } catch (err) {
      alert("❌ Failed to analyze video");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">📺 Analyze YouTube Video</h2>

      <input
        type="text"
        placeholder="https://www.youtube.com/watch?v=3JZ_D3ELwOQ"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <Button onClick={handleAnalyze} className="w-full bg-indigo-600 text-white">
        {loading ? "Analyzing..." : "✨ Analyze Video"}
      </Button>

      {note && (
        <div className="mt-6 space-y-4">
          <div>
            <SummaryResult content={note.summary} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">🎯 Quiz</h3>
            <p className="bg-green-50 p-3 rounded">{note.quiz}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-800">📌 Keywords</h3>
            <p className="bg-purple-50 p-3 rounded">{note.keywords.join(", ")}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-800">🌐 Wikipedia Links</h3>
            <ul className="list-disc pl-6">
              {note.suggestions.map((link, i) => (
                <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalyzer;
