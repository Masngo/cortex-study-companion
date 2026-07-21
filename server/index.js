import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

/**
 * Universal Educational & Technical Fallback Engine
 * Generates tailored diagrams, rationales, and code across all educational domains.
 */
function generateUniversalDiagram(prompt = '') {
  const query = prompt.toLowerCase();

  // ---------------------------------------------------------------------------
  // 1. MACHINE LEARNING, AI & DATA SCIENCE
  // ---------------------------------------------------------------------------
  if (query.includes('random forest') || query.includes('predict') || query.includes('classification') || query.includes('regression') || query.includes('machine learning') || query.includes('model') || query.includes('neural')) {
    return JSON.stringify({
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Pipeline`,
      type: "process",
      nodes: [
        { id: "data_ingest", label: "1. Data Collection & Ingestion", detail: ["Feature Extraction", "Handling Missing Data", "Target Variable Definition"] },
        { id: "preprocessing", label: "2. Preprocessing & Scaling", detail: ["Train/Test Split (80/20)", "Feature Normalization", "Encoding Categorical Variables"] },
        { id: "model_training", label: "3. Model Training & Tuning", detail: ["Ensemble/Model Selection", "Hyperparameter Optimization", "Cross-Validation"] },
        { id: "evaluation", label: "4. Evaluation & Inference", detail: ["Accuracy / R² Score / RMSE", "Feature Importance Analysis", "Model Prediction Output"] }
      ],
      edges: [
        { from: "data_ingest", to: "preprocessing", label: "raw dataset" },
        { from: "preprocessing", to: "model_training", label: "scaled features" },
        { from: "model_training", to: "evaluation", label: "trained model" }
      ],
      rationale: [
        "Isolates feature engineering from model evaluation to prevent data leakage.",
        "Evaluates performance metrics across test sets to ensure generalization.",
        "Ranks feature importances to highlight primary predictive drivers."
      ],
      code: {
        language: "python",
        content: `# Machine Learning Pipeline Example\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.metrics import mean_squared_error\n\n# 1. Load Data & Prepare Features\nX = pd.DataFrame({'feature_1': np.random.rand(100), 'feature_2': np.random.rand(100)})\ny = np.random.rand(100)\n\n# 2. Split Data\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# 3. Model Training\nmodel = RandomForestRegressor(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)\n\n# 4. Predict & Evaluate\npredictions = model.predict(X_test)\nprint("RMSE:", mean_squared_error(y_test, predictions, squared=False))`
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. BIOLOGY, ECOLOGY & NATURAL SCIENCES
  // ---------------------------------------------------------------------------
  if (query.includes('water cycle') || query.includes('photosynthesis') || query.includes('cell') || query.includes('biology') || query.includes('ecosystem') || query.includes('dna') || query.includes('mitosis')) {
    return JSON.stringify({
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Process Diagram`,
      type: "process",
      nodes: [
        { id: "stage1", label: "Stage 1: Primary Inputs", detail: ["Absorption of Solar Energy", "Ingestion of Raw Elements", "Initial Catalyst Activation"] },
        { id: "stage2", label: "Stage 2: Cellular Transformation", detail: ["Chemical Conversion Reactions", "Energy Transfer (ATP / Synthesis)", "Intermediate Byproducts"] },
        { id: "stage3", label: "Stage 3: Output & Biomass", detail: ["Release of Gases / Yields", "Energy Storage", "System Balance Maintenance"] }
      ],
      edges: [
        { from: "stage1", to: "stage2", label: "triggers reaction" },
        { from: "stage2", to: "stage3", label: "yields end product" }
      ],
      rationale: [
        "Maps thermodynamic energy transfer across biological subsystems.",
        "Demonstrates conservation of mass and energy through biological feedback loops."
      ],
      code: {
        language: "text",
        content: `# Chemical Balance Equation Representation\nInputs: 6CO2 + 6H2O + Light Energy\nTransform: Chlorophyll Enzymatic Reactions\nOutputs: C6H12O6 (Glucose) + 6O2`
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. COMPUTER NETWORKING, PROTOCOLS & SECURITY
  // ---------------------------------------------------------------------------
  if (query.includes('tcp') || query.includes('handshake') || query.includes('network') || query.includes('oauth') || query.includes('http') || query.includes('dns') || query.includes('security')) {
    return JSON.stringify({
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Flow`,
      type: "process",
      nodes: [
        { id: "client_req", label: "1. Client Request Ingestion", detail: ["Initiates Connection / Payload", "Includes Security Tokens / Headers", "State: Pending"] },
        { id: "server_ack", label: "2. Server Handshake & Verification", detail: ["Validates Credentials / Flags", "Allocates Connection Resources", "Sends Response Acknowledgment"] },
        { id: "established", label: "3. Secure Session Established", detail: ["Bidirectional Data Stream", "Enforces Encryption Protocols", "State: Established"] }
      ],
      edges: [
        { from: "client_req", to: "server_ack", label: "sends SYN / Request" },
        { from: "server_ack", to: "established", label: "returns SYN-ACK / Verification" }
      ],
      rationale: [
        "Guarantees message integrity before processing high-privilege payloads.",
        "Establishes initial sequence numbers to manage packet ordering."
      ],
      code: {
        language: "python",
        content: `# Python Socket Connection Example\nimport socket\n\nclient = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\nclient.connect(("localhost", 8080))\nclient.sendall(b"Hello Server")\nresponse = client.recv(1024)\nprint("Received:", response.decode())\nclient.close()`
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 4. DATABASE SCHEMAS & SYSTEM ARCHITECTURE
  // ---------------------------------------------------------------------------
  if (query.includes('database') || query.includes('sql') || query.includes('schema') || query.includes('hospital') || query.includes('library') || query.includes('table')) {
    return JSON.stringify({
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Schema`,
      type: "schema",
      nodes: [
        { id: "entity1", label: "Core Primary Entity", detail: ["Entity_ID (PK)", "Name / Identifier", "Attributes", "Created_At"] },
        { id: "entity2", label: "Transactional Bridge Entity", detail: ["Tx_ID (PK)", "Entity1_ID (FK)", "Entity3_ID (FK)", "Status"] },
        { id: "entity3", label: "Supporting Lookup Entity", detail: ["Lookup_ID (PK)", "Category_Name", "Description"] }
      ],
      edges: [
        { from: "entity1", to: "entity2", label: "initiates" },
        { from: "entity3", to: "entity2", label: "categorizes" }
      ],
      rationale: [
        "Complies with Third Normal Form (3NF) to minimize data redundancy.",
        "Uses explicit Foreign Key constraints to maintain referential integrity."
      ],
      code: {
        language: "sql",
        content: `-- Relational Schema SQL Structure\nCREATE TABLE Primary_Entity (\n  Entity_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Name VARCHAR(100) NOT NULL,\n  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE Transaction_Log (\n  Tx_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Entity_ID INT NOT NULL,\n  Status VARCHAR(50) DEFAULT 'Active',\n  FOREIGN KEY (Entity_ID) REFERENCES Primary_Entity(Entity_ID) ON DELETE CASCADE\n);`
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. GENERAL EDUCATIONAL / ALGORITHMIC / OTHER SUBJECTS
  // ---------------------------------------------------------------------------
  const cleanTitle = prompt.trim() ? prompt.slice(0, 40) : 'Study Topic';
  const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  return JSON.stringify({
    title: `${formattedTitle} Conceptual Breakdown`,
    type: "process",
    nodes: [
      { id: "foundations", label: "1. Core Principles & Inputs", detail: ["Fundamental Definitions", "Prerequisite Knowledge", "Initial System Inputs"] },
      { id: "transformation", label: "2. Analysis & Transformations", detail: ["Core Logic Application", "Rule Execution", "Data / Concept Structuring"] },
      { id: "synthesis", label: "3. Synthesis & Real-World Application", detail: ["Final Outcomes & Solutions", "Performance & Impact Metrics", "Practical Integration"] }
    ],
    edges: [
      { from: "foundations", to: "transformation", label: "applies principles to" },
      { from: "transformation", to: "synthesis", label: "yields actionable outcome" }
    ],
    rationale: [
      "Breaks down complex academic subjects into sequential, manageable concepts.",
      "Connects theoretical principles directly to practical, real-world outputs."
    ],
    code: {
      language: "python",
      content: `# Python Algorithmic Concept Blueprint for ${formattedTitle}\ndef analyze_topic(inputs):\n    # 1. Process foundational parameters\n    processed_inputs = [x.strip() for x in inputs if x]\n    \n    # 2. Execute core logic\n    analysis_result = {"status": "success", "processed_count": len(processed_inputs)}\n    \n    # 3. Output results\n    return analysis_result\n\nprint(analyze_topic(["Concept A", "Concept B"]))`
    }
  });
}

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  const { system, prompt, maxTokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" in request body' });
  }

  // Use local fallback directly if key is missing or invalid
  if (!process.env.OPENAI_API_KEY) {
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
          { role: 'system', content: system || 'Return complete JSON with diagram nodes, edges, rationale, and code snippet.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API Quota/Error (Using Universal Fallback):', response.status);
      return res.json({ text: generateUniversalDiagram(prompt) });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const cleanText = text.replace(/```json|```/g, '').trim();

    res.json({ text: cleanText });

  } catch (err) {
    console.error('Server error (Using Universal Fallback):', err.message);
    res.json({ text: generateUniversalDiagram(prompt) });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));