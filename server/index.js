import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

/**
 * Fully Dynamic Universal Diagram Generator
 */
function generateUniversalDiagram(prompt = '') {
  const query = prompt.toLowerCase();
  const cleanTitle = prompt.trim() ? prompt.slice(0, 45) : 'System Model';
  const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  // 1. LIBRARY MANAGEMENT SYSTEM
  if (query.includes('library') || query.includes('book') || query.includes('borrow')) {
    return {
      title: `${formattedTitle} Database Schema`,
      type: "schema",
      nodes: [
        { id: "1", type: "table", label: "Books Table", detail: ["Book_ID (PK)", "Title", "Author", "ISBN", "Stock"], position: { x: 50, y: 100 } },
        { id: "2", type: "table", label: "Members Table", detail: ["Member_ID (PK)", "Name", "Email", "Join_Date"], position: { x: 320, y: 100 } },
        { id: "3", type: "table", label: "Loans Table", detail: ["Loan_ID (PK)", "Book_ID (FK)", "Member_ID (FK)", "Due_Date"], position: { x: 590, y: 100 } }
      ],
      edges: [
        { from: "2", to: "3", label: "borrows" },
        { from: "1", to: "3", label: "is loaned in" }
      ],
      tables: [
        { name: "Books", columns: ["Book_ID (PK)", "Title", "Author", "ISBN", "Stock"] },
        { name: "Members", columns: ["Member_ID (PK)", "Name", "Email", "Join_Date"] },
        { name: "Loans", columns: ["Loan_ID (PK)", "Book_ID (FK)", "Member_ID (FK)", "Due_Date"] }
      ],
      rationale: [
        `Structures ${formattedTitle} by separating catalog assets from membership and active loan transactions.`,
        "Enforces relational foreign keys to track book availability and member checkouts."
      ],
      code: {
        language: "sql",
        content: `-- SQL DDL for ${formattedTitle}\nCREATE TABLE Books (\n  Book_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Title VARCHAR(150) NOT NULL,\n  Author VARCHAR(100),\n  ISBN VARCHAR(20) UNIQUE,\n  Stock INT DEFAULT 1\n);\n\nCREATE TABLE Members (\n  Member_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Name VARCHAR(100) NOT NULL,\n  Email VARCHAR(100) UNIQUE\n);\n\nCREATE TABLE Loans (\n  Loan_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Book_ID INT REFERENCES Books(Book_ID),\n  Member_ID INT REFERENCES Members(Member_ID),\n  Due_Date DATE\n);`
      }
    };
  }

  // 2. HOSPITAL / MEDICAL SYSTEM
  if (query.includes('hospital') || query.includes('patient') || query.includes('doctor') || query.includes('medical')) {
    return {
      title: `${formattedTitle} Database Schema`,
      type: "schema",
      nodes: [
        { id: "1", type: "table", label: "Patients Table", detail: ["Patient_ID (PK)", "Full_Name", "DOB", "Contact"], position: { x: 50, y: 100 } },
        { id: "2", type: "table", label: "Doctors Table", detail: ["Doctor_ID (PK)", "Name", "Specialty", "Office_Room"], position: { x: 320, y: 100 } },
        { id: "3", type: "table", label: "Appointments Table", detail: ["Appt_ID (PK)", "Patient_ID (FK)", "Doctor_ID (FK)", "Timestamp"], position: { x: 590, y: 100 } }
      ],
      edges: [
        { from: "1", to: "3", label: "books" },
        { from: "2", to: "3", label: "assigned to" }
      ],
      tables: [
        { name: "Patients", columns: ["Patient_ID (PK)", "Full_Name", "DOB", "Contact"] },
        { name: "Doctors", columns: ["Doctor_ID (PK)", "Name", "Specialty", "Office_Room"] },
        { name: "Appointments", columns: ["Appt_ID (PK)", "Patient_ID (FK)", "Doctor_ID (FK)", "Timestamp"] }
      ],
      rationale: [
        `Normalizes ${formattedTitle} data by isolating patient records and medical staff schedules.`,
        "Maintains relational integrity across appointment booking logs."
      ],
      code: {
        language: "sql",
        content: `-- SQL DDL for ${formattedTitle}\nCREATE TABLE Patients (\n  Patient_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Full_Name VARCHAR(100) NOT NULL,\n  DOB DATE\n);\n\nCREATE TABLE Doctors (\n  Doctor_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Name VARCHAR(100) NOT NULL,\n  Specialty VARCHAR(50)\n);\n\nCREATE TABLE Appointments (\n  Appt_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Patient_ID INT REFERENCES Patients(Patient_ID),\n  Doctor_ID INT REFERENCES Doctors(Doctor_ID),\n  Timestamp DATETIME\n);`
      }
    };
  }

  // 3. FARM MANAGEMENT (Default database schema fallback)
  if (query.includes('database') || query.includes('schema') || query.includes('sql') || query.includes('farm') || query.includes('system') || query.includes('management') || query.includes('table')) {
    return {
      title: `${formattedTitle} Database Schema`,
      type: "schema",
      nodes: [
        { id: "1", type: "table", label: "Farms Table", detail: ["Farm_ID (PK)", "Farm_Name", "Location", "Owner_ID"], position: { x: 50, y: 100 } },
        { id: "2", type: "table", label: "Inventory / Yield Table", detail: ["Item_ID (PK)", "Farm_ID (FK)", "Category", "Quantity"], position: { x: 320, y: 100 } },
        { id: "3", type: "table", label: "Logs Table", detail: ["Log_ID (PK)", "Farm_ID (FK)", "Activity_Type", "Timestamp"], position: { x: 590, y: 100 } }
      ],
      edges: [
        { from: "1", to: "2", label: "manages inventory" },
        { from: "1", to: "3", label: "tracks operations" }
      ],
      tables: [
        { name: "Farms", columns: ["Farm_ID (PK)", "Farm_Name", "Location", "Owner_ID"] },
        { name: "Inventory", columns: ["Item_ID (PK)", "Farm_ID (FK)", "Category", "Quantity"] },
        { name: "Logs", columns: ["Log_ID (PK)", "Farm_ID (FK)", "Activity_Type", "Timestamp"] }
      ],
      rationale: [
        `Normalizes ${formattedTitle} data by decoupling primary assets from operational logs.`,
        "Enforces relational foreign keys to maintain database consistency."
      ],
      code: {
        language: "sql",
        content: `-- SQL DDL for ${formattedTitle}\nCREATE TABLE Farms (\n  Farm_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Farm_Name VARCHAR(100) NOT NULL,\n  Location VARCHAR(150)\n);\n\nCREATE TABLE Inventory (\n  Item_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Farm_ID INT REFERENCES Farms(Farm_ID),\n  Category VARCHAR(50),\n  Quantity INT DEFAULT 0\n);`
      }
    };
  }

  // 4. GENERAL PROCESS WORKFLOW
  return {
    title: `${formattedTitle} Workflow Diagram`,
    type: "process",
    nodes: [
      { id: "1", label: "1. Core Setup & Inputs", detail: ["Ingest prompt parameters", "Validate environment state"], position: { x: 50, y: 120 } },
      { id: "2", label: "2. Transformation Engine", detail: ["Apply algorithmic logic", "Transform intermediate state"], position: { x: 320, y: 120 } },
      { id: "3", label: "3. Final Synthesis & Output", detail: ["Format final output", "Verify system metrics"], position: { x: 590, y: 120 } }
    ],
    edges: [
      { from: "1", to: "2", label: "passes parameters" },
      { from: "2", to: "3", label: "yields payload" }
    ],
    rationale: [
      `Breaks down ${formattedTitle} into sequential, verifiable processing stages.`,
      "Ensures predictable, deterministic execution across all runtime components."
    ],
    code: {
      language: "python",
      content: `# Implementation Blueprint for ${formattedTitle}\ndef run_pipeline(inputs):\n    data = [x.strip() for x in inputs if x]\n    result = f"Processed {len(data)} elements for ${formattedTitle}"\n    return result\n\nprint(run_pipeline(["Sample Payload"]))`
    }
  };
}

/**
 * Dynamic Practice Question Generator Fallback
 */
function generatePracticeFallback(prompt = '') {
  const topic = prompt.replace(/generate 5 practice questions about:/i, '').trim() || 'this topic';
  const words = topic.split(' ').filter(w => w.length > 3);
  const keywordA = words[0] || 'Core Principle';
  const keywordB = words[1] || 'Component';

  return JSON.stringify({
    topic: topic,
    questions: [
      {
        id: 'q1',
        question: `What is the primary role of ${keywordA} when studying ${topic}?`,
        options: [
          `It serves as the foundational mechanism governing ${topic}`,
          `It acts as an auxiliary logging interface with no functional impact`,
          `It completely replaces external state boundaries in ${topic}`,
          `It disables execution protocols across system nodes`
        ],
        answer: `It serves as the foundational mechanism governing ${topic}`,
        explanation: `In the context of ${topic}, ${keywordA} plays a crucial structural role by controlling initial inputs and execution rules.`
      },
      {
        id: 'q2',
        question: `How does ${keywordB} interact within the workflow of ${topic}?`,
        options: [
          `By bypassing state verification steps`,
          `By processing intermediate transformations and validating conditions`,
          `By forcing static memory allocation across all runtime routines`,
          `By preventing data ingestion from primary sources`
        ],
        answer: `By processing intermediate transformations and validating conditions`,
        explanation: `${keywordB} handles critical state transitions and rule verification during the execution lifecycle of ${topic}.`
      },
      {
        id: 'q3',
        question: `Which scenario represents a common failure state in ${topic}?`,
        options: [
          `Executing valid inputs within designated bounds`,
          `Unchecked parameter divergence or missing constraints`,
          `Automated success logging after execution`,
          `Proper normalization of core structural entities`
        ],
        answer: `Unchecked parameter divergence or missing constraints`,
        explanation: `Without strict parameter checking and boundary enforcement, ${topic} can experience invalid state errors.`
      },
      {
        id: 'q4',
        question: `Why is modular decomposition beneficial when analyzing ${topic}?`,
        options: [
          `It isolates components for easier testing, scaling, and maintenance`,
          `It increases overall system complexity unnecessarily`,
          `It prevents any reusability of core logic`,
          `It restricts operational execution to a single static thread`
        ],
        answer: `It isolates components for easier testing, scaling, and maintenance`,
        explanation: `Breaking ${topic} down into distinct modules allows each sub-component to be verified and optimized independently.`
      },
      {
        id: 'q5',
        question: `What is the expected end result upon completing the ${topic} process?`,
        options: [
          `A verified, structured outcome aligning with defined requirements`,
          `An unformatted raw memory dump with missing fields`,
          `An aborted execution thread with state loss`,
          `An unverified circular feedback loop`
        ],
        answer: `A verified, structured outcome aligning with defined requirements`,
        explanation: `A properly executed ${topic} workflow finishes by returning validated results that meet target constraints.`
      }
    ]
  });
}

/**
 * Dynamic Connections Generator Fallback
 */
function generateConnectionsFallback(prompt = '') {
  const match = prompt.match(/Compare "(.*?)" and "(.*?)"/i);
  const topicA = match ? match[1] : 'Topic A';
  const topicB = match ? match[2] : 'Topic B';

  const text = `### Comparative Synthesis: ${topicA} vs. ${topicB}

**Core Analysis:**
While **${topicA}** and **${topicB}** address different aspects of their respective domains, both rely on structured execution rules, state maintenance, and systematic validation to achieve reliable outcomes.

---

### Key Comparison Dimensions

1. **Primary Focus & Purpose**
   - **${topicA}:** Concentrates on establishing structural rules, execution flow, and handling domain parameters.
   - **${topicB}:** Focuses on managing transformation pipelines, state transitions, and downstream integration.

2. **Operational Mechanisms**
   - **${topicA}:** Executes sequentially through defined input boundaries and validation constraints.
   - **${topicB}:** Utilizes feedback loops or multi-stage processes to ensure operational consistency.

3. **Practical Trade-offs & Integration**
   - **${topicA}:** Offers high precision in its primary domain, though it requires verified inputs.
   - **${topicB}:** Provides broader flexibility, making it adaptable across complementary workflows.

---

**Key Takeaway:**
Understanding both **${topicA}** and **${topicB}** highlights how different system models enforce integrity—one through strict input boundaries and the other through dynamic process management.`;

  return JSON.stringify({
    connection: text,
    summary: text,
    text: text
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
  const isConnectionsRequest = sysStr.includes('compare') || sysStr.includes('connection') || sysStr.includes('relationship') || promptStr.includes('compare');

  if (isConnectionsRequest) {
    return res.json({ text: generateConnectionsFallback(prompt) });
  }
  if (isPracticeRequest) {
    return res.json({ text: generatePracticeFallback(prompt) });
  }

  return res.json({ text: JSON.stringify(generateUniversalDiagram(prompt)) });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));
