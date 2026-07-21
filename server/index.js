import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

/**
 * Smart Fallback for Practice Questions & Quizzes
 */
function generatePracticeFallback(topic = '') {
  const t = topic.toLowerCase();

  // TCP / Networking Practice Questions
  if (t.includes('tcp') || t.includes('handshake') || t.includes('network')) {
    return JSON.stringify({
      topic: topic,
      questions: [
        {
          id: 'q1',
          question: 'What is the primary purpose of the initial SYN packet in a TCP 3-way handshake?',
          options: [
            'To synchronize sequence numbers and initiate a connection request',
            'To immediately transfer encrypted payload data',
            'To terminate an existing TCP session gracefully',
            'To calculate network bandwidth latency'
          ],
          answer: 'To synchronize sequence numbers and initiate a connection request',
          explanation: 'The SYN (Synchronize) packet informs the receiver of the sender\'s initial sequence number (ISN) to establish packet ordering.'
        },
        {
          id: 'q2',
          question: 'What response does the server send back upon receiving a SYN flag?',
          options: [
            'ACK only',
            'SYN-ACK',
            'FIN-ACK',
            'RST'
          ],
          answer: 'SYN-ACK',
          explanation: 'The server acknowledges the client\'s SYN by incrementing its sequence number and sending its own SYN flag back simultaneously (SYN-ACK).'
        }
      ]
    });
  }

  // Generic Practice Questions Fallback for any topic
  return JSON.stringify({
    topic: topic,
    questions: [
      {
        id: 'q1',
        question: `What is the core underlying concept of ${topic || 'this subject'}?`,
        options: [
          'Modular structural decomposition and systematic processing',
          'Randomized unstructured data storage',
          'Single-threaded execution without feedback mechanisms',
          'Manual memory allocation without boundaries'
        ],
        answer: 'Modular structural decomposition and systematic processing',
        explanation: 'Breaking complex processes into modular steps ensures reliability, maintainability, and clear execution bounds.'
      },
      {
        id: 'q2',
        question: `Why is relationship normalization/mapping critical in ${topic || 'this domain'}?`,
        options: [
          'It eliminates data redundancy and enforces integrity',
          'It increases latency across network boundaries',
          'It forces all state to be volatile',
          'It disables user access controls'
        ],
        answer: 'It eliminates data redundancy and enforces integrity',
        explanation: 'Normalization prevents duplicate entries and ensures changes to data elements propagate consistently.'
      }
    ]
  });
}

/**
 * Universal Educational & Technical Fallback Engine
 */
function generateUniversalDiagram(prompt = '') {
  const query = prompt.toLowerCase();

  // 1. MACHINE LEARNING, AI & DATA SCIENCE
  if (query.includes('random forest') || query.includes('predict') || query.includes('classification') || query.includes('regression') || query.includes('machine learning') || query.includes('model') || query.includes('neural')) {
    return JSON.stringify({
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Pipeline`,
      type: "process",
      nodes: [
        { id: "data_ingest", label: "1. Data Collection", detail: ["Feature Extraction", "Target Variable Definition"] },
        { id: "preprocessing", label: "2. Preprocessing", detail: ["Train/Test Split", "Feature Normalization"] },
        { id: "model_training", label: "3. Model Training", detail: ["Ensemble Selection", "Cross-Validation"] },
        { id: "evaluation", label: "4. Evaluation", detail: ["Accuracy / RMSE", "Feature Importance Analysis"] }
      ],
      edges: [
        { from: "data_ingest", to: "preprocessing", label: "raw dataset" },
        { from: "preprocessing", to: "model_training", label: "scaled features" },
        { from: "model_training", to: "evaluation", label: "trained model" }
      ],
      rationale: ["Isolates feature engineering from model evaluation to prevent data leakage."],
      code: { language: "python", content: `# Model Training snippet\nimport sklearn` }
    });
  }

  // 2. BIOLOGY, ECOLOGY & NATURAL SCIENCES
  if (query.includes('water cycle') || query.includes('photosynthesis') || query.includes('cell') || query.includes('biology')) {
    return JSON.stringify({
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Process Diagram`,
      type: "process",
      nodes: [
        { id: "stage1", label: "Stage 1: Primary Inputs", detail: ["Absorption of Energy", "Initial Catalyst"] },
        { id: "stage2", label: "Stage 2: Transformation", detail: ["Chemical Reactions", "Energy Transfer"] },
        { id: "stage3", label: "Stage 3: Output", detail: ["Release of Yields", "System Balance"] }
      ],
      edges: [{ from: "stage1", to: "stage2", label: "triggers" }, { from: "stage2", to: "stage3", label: "yields" }],
      rationale: ["Demonstrates conservation of mass and energy through biological feedback loops."],
      code: { language: "text", content: `# Reaction representation` }
    });
  }

  // 3. DATABASE SCHEMAS & SYSTEM ARCHITECTURE
  if (query.includes('database') || query.includes('sql') || query.includes('schema') || query.includes('hospital') || query.includes('table')) {
    return JSON.stringify({
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Schema`,
      type: "schema",
      nodes: [
        { id: "entity1", label: "Primary Entity", detail: ["Entity_ID (PK)", "Created_At"] },
        { id: "entity2", label: "Transactional Bridge", detail: ["Tx_ID (PK)", "Entity1_ID (FK)", "Status"] }
      ],
      edges: [{ from: "entity1", to: "entity2", label: "initiates" }],
      rationale: ["Complies with Third Normal Form (3NF)."],
      code: { language: "sql", content: `CREATE TABLE Primary_Entity (Entity_ID INT PRIMARY KEY);` }
    });
  }

  // 4. GENERAL EDUCATIONAL SUBJECTS
  const cleanTitle = prompt.trim() ? prompt.slice(0, 40) : 'Study Topic';
  const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  return JSON.stringify({
    title: `${formattedTitle} Conceptual Breakdown`,
    type: "process",
    nodes: [
      { id: "foundations", label: "1. Core Principles", detail: ["Fundamental Definitions", "Inputs"] },
      { id: "transformation", label: "2. Analysis", detail: ["Core Logic Application", "Structuring"] },
      { id: "synthesis", label: "3. Synthesis", detail: ["Final Outcomes", "Impact Metrics"] }
    ],
    edges: [{ from: "foundations", to: "transformation", label: "applies to" }, { from: "transformation", to: "synthesis", label: "yields" }],
    rationale: ["Breaks down complex subjects into sequential concepts."],
    code: { language: "python", content: `# Blueprint implementation` }
  });
}

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  const { system, prompt, maxTokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" in request body' });
  }

  // Detect if the request is asking for practice questions
  const isPracticeRequest = 
    (system && (system.toLowerCase().includes('question') || system.toLowerCase().includes('practice') || system.toLowerCase().includes('quiz'))) ||
    (prompt && (prompt.toLowerCase().includes('question') || prompt.toLowerCase().includes('quiz')));

  // Use local fallback directly if key is missing or invalid
  if (!process.env.OPENAI_API_KEY) {
    const fallbackText = isPracticeRequest ? generatePracticeFallback(prompt) : generateUniversalDiagram(prompt);
    return res.json({ text: fallbackText });
  }

  try {
    const modelName = process.env.OPENAI_MODEL || 'gpt-4o';

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
          { role: 'system', content: system || 'Return JSON payload.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API Quota/Error:', response.status);
      const fallbackText = isPracticeRequest ? generatePracticeFallback(prompt) : generateUniversalDiagram(prompt);
      return res.json({ text: fallbackText });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const cleanText = text.replace(/```json|```/g, '').trim();

    res.json({ text: cleanText });

  } catch (err) {
    console.error('Server error:', err.message);
    const fallbackText = isPracticeRequest ? generatePracticeFallback(prompt) : generateUniversalDiagram(prompt);
    res.json({ text: fallbackText });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));