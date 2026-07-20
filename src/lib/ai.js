// Calls our own backend (server/index.js), which holds the OpenAI API key.
// The browser never sees the key — this is important for a real submission,
// not just a nicety, since anything shipped client-side is publicly readable.
export async function callAI(system, prompt, maxTokens = 1800) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, prompt, maxTokens }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'AI request failed');
  }
  const data = await res.json();
  return data.text;
}
