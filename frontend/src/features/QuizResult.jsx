import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

const QuizResult = ({ content }) => {
  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl text-green-700">📚 AI-Generated Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm text-gray-800">{content}</pre>
      </CardContent>
    </Card>
  );
};

export default QuizResult;


