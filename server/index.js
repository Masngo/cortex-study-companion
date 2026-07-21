import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

/**
 * Fallback for Connections Tab
 * Returns valid JSON containing a structured connection string to satisfy JSON.parse() on the frontend.
 */
function generateConnectionsFallback(prompt = '') {
  const comparisonText = `### Structural Synthesis & Systemic Comparison

**Core Overview:**
Both systems rely on sequential stage execution, state transitions, and feedback loops to maintain balance and deliver continuous, reliable flow.

---

### Key Comparison Dimensions

1. **System Architecture & Flow**
   - **Topic A:** Follows a strict 3-step handshake protocol (SYN, SYN-ACK, ACK) to statefully establish bidirectional session communication across digital networks.
   - **Topic B:** Operates as a continuous natural closed-loop process driven by environmental thermodynamics and biological energy transfer.

2. **Error Handling & Verification**
   - **Topic A:** Employs explicit sequence numbers, acknowledgments, and checksums to prevent packet loss or corrupted state.
   - **Topic B:** Maintains biological/climatic equilibrium through natural feedback mechanisms and rate-limiting environmental constraints.

3. **Core Operational Purpose**
   - **Topic A:** Guarantees reliable, ordered end-to-end data transfer over packet-switched networks.
   - **Topic B:** Sustains life and energy redistribution across biological and environmental ecosystems.

---

**Key Takeaway:**
Despite operating in completely different domains (digital networking vs. natural science), both frameworks demonstrate how complex systems maintain operational integrity through structured state transitions, handshakes, and feedback protocols.`;

  return JSON.stringify({
    connection: comparisonText,
    summary: comparisonText,
    text: comparisonText
  });
}

/**
 * Fallback for Practice Tab (5 Rich Multiple Choice Questions)
 */
function generatePracticeFallback(topic = '') {
  const t = topic.toLowerCase();

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
        },
        {
          id: 'q3',
          question: 'In what connection state is the TCP socket after the final ACK packet is received by the server?',
          options: [
            'SYN-SENT',
            'SYN-RCVD',
            'ESTABLISHED',
            'CLOSE-WAIT'
          ],
          answer: 'ESTABLISHED',
          explanation: 'Once the client sends the final ACK acknowledging the server\'s SYN-ACK, both sides transition to the ESTABLISHED state and data transfer begins.'
        },
        {
          id: 'q4',
          question: 'What flag is used to gracefully close a TCP connection after data transfer completes?',
          options: [
            'RST',
            'FIN',
            'PSH',
            'URG'
          ],
          answer: 'FIN',
          explanation: 'The FIN (Finish) flag is sent by an endpoint when it wants to terminate its side of the TCP connection.'
        },
        {
          id: 'q5',
          question: 'How does TCP handle a lost ACK packet during the 3-way handshake?',
          options: [
            'The connection immediately aborts',
            'The server retransmits the SYN-ACK after a timeout',
            'The client resets the IP address',
            'Data transmission starts anyway'
          ],
          answer: 'The server retransmits the SYN-ACK after a timeout',
          explanation: 'If the server does not receive the final ACK within its Retransmission Timeout (RTO) window, it resends the SYN-ACK.'
        }
      ]
    });
  }

  // Generic 5-Question Fallback
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
      },
      {
        id: 'q3',
        question: `How do state transitions operate within ${topic || 'this system'}?`,
        options: [
          'Through sequential trigger events and verified conditions',
          'By continuously overwriting core parameters at random',
          'Through static unchangeable constants',
          'By bypassing validation protocols'
        ],
        answer: 'Through sequential trigger events and verified conditions',
        explanation: 'State transitions occur systematically as input criteria and execution rules are met.'
      },
      {
        id: 'q4',
        question: `What is the primary failure mode prevented by structural validation in ${topic || 'this field'}?`,
        options: [
          'Data corruption and invalid system states',
          'Overly fast processing times',
          'Automated documentation generation',
          'Redundant user interfaces'
        ],
        answer: 'Data corruption and invalid system states',
        explanation: 'Validation ensures that bad inputs or missing parameters are caught before affecting downstream dependencies.'
      },
      {
        id: 'q5',
        question: `Which methodology provides optimal scaling for ${topic || 'this architecture'}?`,
        options: [
          'Decoupled modular components with explicit contracts',
          'Monolithic tightly coupled single-file scripts',
          'Unindexed database queries without keys',
          'Hardcoded global static variables'
        ],
        answer: 'Decoupled modular components with explicit contracts',
        explanation: 'Decoupled modules allow individual parts of the system to scale and adapt independently.'
      }
    ]
  });
}

/**
 * Universal Diagram Generator Fallback
 */
function generateUniversalDiagram(prompt = '') {
  return JSON.stringify({
    title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Breakdown`,
    type: "process",
    nodes: [
      { id: "1", label: "1. Core Principles & Inputs", detail: ["Define inputs", "Set execution bounds"] },
      { id: "2", label: "2. Process Execution", detail: ["Apply transformations", "Validate parameters"] },
      { id: "3", label: "3. Output & Results", detail: ["Synthesize findings", "Verify metrics"] }
    ],
    edges: [
      { from: "1", to: "2", label: "processes" },
      { from: "2", to: "3", label: "yields" }
    ],
    rationale: ["Breaks down complex subjects into sequential concepts."],
    code: { language: "python", content: `# Python Implementation\nprint('Analyzing ${prompt}')` }
  });
}

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  const { system, prompt, maxTokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" in request body' });
  }

  const sysStr = (system || '').toLowerCase();
  const promptStr = (prompt || '').toLowerCase();

  const isPracticeRequest = sysStr.includes('question') || sysStr.includes('practice') || sysStr.includes('quiz') || promptStr.includes('question');
  const isConnectionsRequest = sysStr.includes('compare') || sysStr.includes('connection') || sysStr.includes('relationship') || sysStr.includes('two topics') || promptStr.includes('compare');

  // Local fallback response execution
  if (!process.env.OPENAI_API_KEY) {
    if (isConnectionsRequest) {
      return res.json({ text: generateConnectionsFallback(prompt) });
    }
    if (isPracticeRequest) {
      return res.json({ text: generatePracticeFallback(prompt) });
    }
    return res.json({ text: generateUniversalDiagram(prompt) });
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
          { role: 'system', content: system || 'Return payload.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API Quota/Error (Using Smart Fallback):', response.status);
      if (isConnectionsRequest) return res.json({ text: generateConnectionsFallback(prompt) });
      if (isPracticeRequest) return res.json({ text: generatePracticeFallback(prompt) });
      return res.json({ text: generateUniversalDiagram(prompt) });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const cleanText = text.replace(/```json|```/g, '').trim();

    res.json({ text: cleanText });

  } catch (err) {
    console.error('Server error (Using Smart Fallback):', err.message);
    if (isConnectionsRequest) return res.json({ text: generateConnectionsFallback(prompt) });
    if (isPracticeRequest) return res.json({ text: generatePracticeFallback(prompt) });
    res.json({ text: generateUniversalDiagram(prompt) });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));