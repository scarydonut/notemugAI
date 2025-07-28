import React, { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import SummaryResult from "../features/SummaryResult";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const user = JSON.parse(localStorage.getItem("notegenius-user"));
const userId = user && user._id ? user._id : null;

console.log("📤 Uploading for userId:", userId);

if (!userId) {
  alert("You're not logged in. Please log in first.");
  return;
}


  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("userId", userId);

    setUploading(true);
    try {
      const res = await axios.post("https://back-x6zy.onrender.com/api/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data.note);
    } catch (err) {
      console.error("❌ Upload Error:", err.response?.data || err.message);
      alert("❌ Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">📤 Upload PDF Notes</h2>

      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <Button onClick={handleUpload} className="mt-4 bg-indigo-600 text-white">
        {uploading ? "Processing..." : "✨ Upload & Summarize"}
      </Button>

      {result && (
        <div className="mt-8 space-y-6">
          <div>
            <SummaryResult content={result.summary} />
          </div>
          <div>
            <h3 className="text-xl font-semibold">🎯 Flashcards</h3>
            <div className="bg-green-50 p-3 rounded space-y-2">
              {result.quiz?.split("\n\n").map((q, i) => {
                const [qText, aText] = q.split("\n");
                return (
                  <div key={i}>
                    <p><strong>Q:</strong> {qText?.replace(/^Q:\s*/, "")}</p>
                    <p><strong>A:</strong> {aText?.replace(/^A:\s*/, "")}</p>
                  </div>
                );
              })}
            </div>
          </div>
          {result.keywords?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold">🔑 Keywords</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-yellow-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
          {result.suggestions?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold">🌐 Suggested Content</h3>
              <ul className="list-disc pl-5 space-y-2 text-blue-700">
                {result.suggestions.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-900"
                    >
                      {link.includes("youtube") ? "YouTube Resource" : "Wikipedia Article"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfUploader;

