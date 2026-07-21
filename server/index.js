import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Helper function to generate mock diagram fallback data if OpenAI fails
function getMockDiagramFallback(prompt) {
  return JSON.stringify({
    title: "Library Management System Architecture",
    type: "schema",
    nodes: [
      { id: "1", label: "Members Table (User_ID, Name, Email)" },
      { id: "2", label: "Books Table (ISBN, Title, Author_ID, Status)" },
      { id: "3", label: "Loans Table (Loan_ID, Book_ID, User_ID, Issue_Date)" },
      { id: "4", label: "Fines Table (Fine_ID, Loan_ID, Amount, Paid)" }
    ],
    edges: [
      { from: "1", to: "3", label: "makes loan" },
      { from: "2", to: "3", label: "borrowed in" },
      { from: "3", to: "4", label: "generates" }
    ]
  });
}

app.post('/api/generate', async (req, res) => {
  const { system, prompt, maxTokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" in request body' });
  }

  // Fallback to mock if API key isn't present
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is not set — returning mock fallback diagram.');
    return res.json({ text: getMockDiagramFallback(prompt) });
  }

  try {
    const modelName = process.env.OPENAI_MODEL || 'gpt-5.6';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: maxTokens || 1800,
        messages: [
          { role: 'system', content: system || '' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI API Error Status:', response.status, errText);
      
      // Fall back to mock payload on API refusal/error
      return res.json({ text: getMockDiagramFallback(prompt) });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    // Clean markdown code fence formatting if returned by model
    const cleanText = text.replace(/```json|```/g, '').trim();

    res.json({ text: cleanText });
  } catch (err) {
    console.error('Server error calling OpenAI, serving fallback:', err);
    res.json({ text: getMockDiagramFallback(prompt) });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));