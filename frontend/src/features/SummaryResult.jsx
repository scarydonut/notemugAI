import React, { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const highlightTerms = (text, onClick) => {
  return text.split(" ").map((word, index) => (
    <span
      key={index}
      className="cursor-pointer hover:underline text-blue-700 font-medium"
      onClick={() => onClick(word)}
    >
      {word + " "}
    </span>
  ));
};

const SummaryResult = ({ content }) => {
  const [definition, setDefinition] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async (word) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/ai/define", {
        phrase: word,
      });
      setDefinition(res.data.explanation);
    } catch (err) {
      setDefinition("❌ Failed to get definition.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-md border border-gray-200 mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-indigo-700">🧠 AI Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-sm text-gray-800">
          {highlightTerms(content, handleExplain)}
        </div>

        {loading && (
          <div className="mt-3 text-yellow-700 text-sm">🔍 Loading definition...</div>
        )}

        {definition && !loading && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow text-sm text-gray-800">
            💡 <strong>Definition:</strong> {definition}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryResult;

