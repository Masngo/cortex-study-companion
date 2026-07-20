import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// POST /api/generate
// body: { system: string, prompt: string, maxTokens?: number }
// Proxies to OpenAI's chat completions endpoint using GPT-5.6, so the API
// key never reaches the browser. Returns { text: string }.
app.post('/api/generate', async (req, res) => {
  const { system, prompt, maxTokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" in request body' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not set on the server (see .env.example)' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        // NOTE: confirm the exact model identifier string in OpenAI's docs
        // at build time — "gpt-5.6" is the model name as referenced by the
        // hackathon; API model slugs occasionally differ from marketing names.
        model: process.env.OPENAI_MODEL || 'gpt-5.6',
        max_tokens: maxTokens || 1800,
        messages: [
          { role: 'system', content: system || '' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI API error:', response.status, errText);
      return res.status(502).json({ error: 'Upstream AI request failed' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    res.json({ text: text.replace(/```json|```/g, '').trim() });
  } catch (err) {
    console.error('Server error calling OpenAI:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));
