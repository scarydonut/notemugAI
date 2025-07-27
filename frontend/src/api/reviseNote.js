import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const getRevisionPlan = async (note) => {
const prompt = `
You are an AI-powered study coach. Based on the note content below, generate a personalized revision strategy to help the student retain and understand the material memory strengthening techniques.

Be concise but detailed. Explain:
- How to revise effectively using this note
- When to revise it (suggest days or intervals)
- What to do during each revision (active recall, quiz, summaries, etc.)
- Bonus tips for long-term retention
- Dont give 7 days strategy just give how to revise 
- Give in atleast 60 words paragraph
Note Title: ${note.title}
Summary: ${note.summary}
Quiz: ${note.quiz}

Output:
- Introduction (why this strategy helps)
- How to memorize, how to study, how to understand, how to revise
- Tips for long-term mastery
`.trim();


  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
};
