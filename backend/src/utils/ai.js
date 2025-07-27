import axios from "axios";

const API_KEY = process.env.OPENROUTER_API_KEY;

export async function generateSummary(text) {
  try {
    const prompt = `Summarize the following PDF content into bullet points:\n\n${text}`;
    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    });

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ Failed to summarize:", err.message);
    throw err;
  }
}

export async function generateQuiz(text) {
  try {
    const prompt = `Generate 10 quiz questions (MCQ/True-False/Fill in the blanks) from this content:\n\n${text}`;
    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ Failed to summarize:", err.message);
    throw err;
  }
}
