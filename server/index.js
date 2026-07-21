import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

/**
 * Intelligent Dynamic Schema & SQL Generator
 */
function generateDynamicSchema(prompt = '') {
  const query = prompt.toLowerCase();
  const rawTitle = prompt.replace(/design a database for|create a database|schema for/gi, '').trim() || 'System Management';
  const formattedTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  // 1. HOSPITAL / MEDICAL SYSTEM
  if (query.includes('hospital') || query.includes('patient') || query.includes('doctor') || query.includes('medical')) {
    return {
      title: `${formattedTitle} Schema`,
      type: "schema",
      tables: [
        { name: "Patients", columns: ["Patient_ID (PK)", "Full_Name", "DOB", "Phone", "Address"] },
        { name: "Doctors", columns: ["Doctor_ID (PK)", "Name", "Specialty", "Room_Number"] },
        { name: "Appointments", columns: ["Appt_ID (PK)", "Patient_ID (FK)", "Doctor_ID (FK)", "Appt_Date", "Status"] }
      ],
      rationale: [
        `Isolates patient demographic data from doctor schedules for clean hospital management.`,
        `Maintains appointment foreign keys to prevent double-booking.`
      ],
      code: {
        language: "sql",
        content: `-- Complete Multi-Table Schema for ${formattedTitle}\nCREATE TABLE Patients (\n  Patient_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Full_Name VARCHAR(100) NOT NULL,\n  DOB DATE NOT NULL,\n  Phone VARCHAR(20),\n  Address VARCHAR(255)\n);\n\nCREATE TABLE Doctors (\n  Doctor_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Name VARCHAR(100) NOT NULL,\n  Specialty VARCHAR(100) NOT NULL,\n  Room_Number VARCHAR(20)\n);\n\nCREATE TABLE Appointments (\n  Appt_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Patient_ID INT NOT NULL,\n  Doctor_ID INT NOT NULL,\n  Appt_Date DATETIME NOT NULL,\n  Status VARCHAR(50) DEFAULT 'Scheduled',\n  FOREIGN KEY (Patient_ID) REFERENCES Patients(Patient_ID),\n  FOREIGN KEY (Doctor_ID) REFERENCES Doctors(Doctor_ID)\n);`
      }
    };
  }

  // 2. SCHOOL / UNIVERSITY MANAGEMENT SYSTEM
  if (query.includes('school') || query.includes('student') || query.includes('course') || query.includes('teacher') || query.includes('university')) {
    return {
      title: `${formattedTitle} Schema`,
      type: "schema",
      tables: [
        { name: "Students", columns: ["Student_ID (PK)", "First_Name", "Last_Name", "Email", "Enrollment_Date"] },
        { name: "Courses", columns: ["Course_ID (PK)", "Course_Code", "Title", "Credits"] },
        { name: "Enrollments", columns: ["Enrollment_ID (PK)", "Student_ID (FK)", "Course_ID (FK)", "Grade"] }
      ],
      rationale: [
        `Separates student records from course catalogs, linking them through a many-to-many Enrollments table.`,
        `Enforces referential integrity on course registrations and grades.`
      ],
      code: {
        language: "sql",
        content: `-- Complete Multi-Table Schema for ${formattedTitle}\nCREATE TABLE Students (\n  Student_ID INT PRIMARY KEY AUTO_INCREMENT,\n  First_Name VARCHAR(50) NOT NULL,\n  Last_Name VARCHAR(50) NOT NULL,\n  Email VARCHAR(100) UNIQUE NOT NULL,\n  Enrollment_Date DATE DEFAULT (CURRENT_DATE)\n);\n\nCREATE TABLE Courses (\n  Course_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Course_Code VARCHAR(20) UNIQUE NOT NULL,\n  Title VARCHAR(150) NOT NULL,\n  Credits INT DEFAULT 3\n);\n\nCREATE TABLE Enrollments (\n  Enrollment_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Student_ID INT NOT NULL,\n  Course_ID INT NOT NULL,\n  Grade VARCHAR(5),\n  FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),\n  FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID)\n);`
      }
    };
  }

  // 3. CHURCH MANAGEMENT SYSTEM
  if (query.includes('church') || query.includes('congregation') || query.includes('ministry') || query.includes('tithe')) {
    return {
      title: `${formattedTitle} Schema`,
      type: "schema",
      tables: [
        { name: "Members", columns: ["Member_ID (PK)", "Full_Name", "Phone", "Email", "Membership_Status"] },
        { name: "Ministries", columns: ["Ministry_ID (PK)", "Ministry_Name", "Leader_ID (FK)", "Meeting_Day"] },
        { name: "Contributions", columns: ["Contribution_ID (PK)", "Member_ID (FK)", "Amount", "Fund_Type", "Date"] }
      ],
      rationale: [
        `Organizes congregation members and departmental ministries with designated leadership keys.`,
        `Tracks financial tithes and offerings securely linked to individual member profiles.`
      ],
      code: {
        language: "sql",
        content: `-- Complete Multi-Table Schema for ${formattedTitle}\nCREATE TABLE Members (\n  Member_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Full_Name VARCHAR(100) NOT NULL,\n  Phone VARCHAR(20),\n  Email VARCHAR(100) UNIQUE,\n  Membership_Status VARCHAR(50) DEFAULT 'Active'\n);\n\nCREATE TABLE Ministries (\n  Ministry_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Ministry_Name VARCHAR(100) NOT NULL,\n  Leader_ID INT,\n  Meeting_Day VARCHAR(30),\n  FOREIGN KEY (Leader_ID) REFERENCES Members(Member_ID)\n);\n\nCREATE TABLE Contributions (\n  Contribution_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Member_ID INT NOT NULL,\n  Amount DECIMAL(10,2) NOT NULL,\n  Fund_Type VARCHAR(50) DEFAULT 'General Tithe',\n  Date DATE DEFAULT (CURRENT_DATE),\n  FOREIGN KEY (Member_ID) REFERENCES Members(Member_ID)\n);`
      }
    };
  }

  // 4. LIBRARY MANAGEMENT SYSTEM
  if (query.includes('library') || query.includes('book') || query.includes('borrow')) {
    return {
      title: `${formattedTitle} Schema`,
      type: "schema",
      tables: [
        { name: "Members", columns: ["Member_ID (PK)", "Name", "Email", "Join_Date"] },
        { name: "Books", columns: ["ISBN (PK)", "Title", "Author", "Publisher", "Copies_Available"] },
        { name: "Loans", columns: ["Loan_ID (PK)", "Member_ID (FK)", "ISBN (FK)", "Due_Date", "Return_Date"] }
      ],
      rationale: [
        `Isolates library members from book inventories and tracks active checkout loans.`,
        `Enforces stock limitations and due date constraints.`
      ],
      code: {
        language: "sql",
        content: `-- Complete Multi-Table Schema for Library Management\nCREATE TABLE Members (\n  Member_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Name VARCHAR(100) NOT NULL,\n  Email VARCHAR(100) UNIQUE NOT NULL,\n  Join_Date DATE DEFAULT (CURRENT_DATE)\n);\n\nCREATE TABLE Books (\n  ISBN VARCHAR(20) PRIMARY KEY,\n  Title VARCHAR(255) NOT NULL,\n  Author VARCHAR(100) NOT NULL,\n  Publisher VARCHAR(100),\n  Copies_Available INT DEFAULT 1\n);\n\nCREATE TABLE Loans (\n  Loan_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Member_ID INT NOT NULL,\n  ISBN VARCHAR(20) NOT NULL,\n  Issue_Date DATE DEFAULT (CURRENT_DATE),\n  Due_Date DATE NOT NULL,\n  Return_Date DATE,\n  FOREIGN KEY (Member_ID) REFERENCES Members(Member_ID),\n  FOREIGN KEY (ISBN) REFERENCES Books(ISBN)\n);`
      }
    };
  }

  // 5. UNIVERSAL / CUSTOM DATABASE SCHEMA FALLBACK
  return {
    title: `${formattedTitle} Schema`,
    type: "schema",
    tables: [
      { name: "Entities", columns: ["Entity_ID (PK)", "Name", "Description", "Created_At"] },
      { name: "Transactions", columns: ["Tx_ID (PK)", "Entity_ID (FK)", "Details", "Amount"] },
      { name: "Audit_Logs", columns: ["Log_ID (PK)", "Tx_ID (FK)", "Action", "Timestamp"] }
    ],
    rationale: [
      `Normalizes ${formattedTitle} into core entities, transactional records, and audit logs.`,
      `Maintains foreign key constraints for robust data integrity.`
    ],
    code: {
      language: "sql",
      content: `-- Complete Multi-Table Schema for ${formattedTitle}\nCREATE TABLE Entities (\n  Entity_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Name VARCHAR(100) NOT NULL,\n  Description TEXT,\n  Created_At DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE Transactions (\n  Tx_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Entity_ID INT NOT NULL,\n  Details VARCHAR(255),\n  Amount DECIMAL(10,2),\n  FOREIGN KEY (Entity_ID) REFERENCES Entities(Entity_ID)\n);\n\nCREATE TABLE Audit_Logs (\n  Log_ID INT PRIMARY KEY AUTO_INCREMENT,\n  Tx_ID INT NOT NULL,\n  Action VARCHAR(50) NOT NULL,\n  Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (Tx_ID) REFERENCES Transactions(Tx_ID)\n);`
    }
  };
}

/**
 * Practice Question Generator Fallback
 */
function generatePracticeFallback(prompt = '') {
  const topic = prompt.replace(/generate 5 practice questions about:/i, '').trim() || 'this topic';
  return JSON.stringify({
    topic: topic,
    questions: [
      {
        id: 'q1',
        question: `What is the primary objective when designing ${topic}?`,
        options: [
          `Ensuring data normalization and relational integrity`,
          `Removing all primary key constraints`,
          `Storing all records in a single flat file`,
          `Disabling foreign key checks`
        ],
        answer: `Ensuring data normalization and relational integrity`,
        explanation: `Proper design principles emphasize normalization to avoid data redundancy and maintain consistency.`
      },
      {
        id: 'q2',
        question: `Which component represents a unique identifier for a table row?`,
        options: [`Foreign Key`, `Primary Key`, `Index Scan`, `Subquery`],
        answer: `Primary Key`,
        explanation: `A Primary Key uniquely identifies each record within a database table.`
      },
      {
        id: 'q3',
        question: `Why are foreign keys utilized in relational databases?`,
        options: [
          `To link related tables and maintain referential integrity`,
          `To encrypt database passwords`,
          `To speed up disk formatting`,
          `To delete records automatically without logging`
        ],
        answer: `To link related tables and maintain referential integrity`,
        explanation: `Foreign keys establish relationships between parent and child tables.`
      },
      {
        id: 'q4',
        question: `What is a common consequence of failing to normalize a database?`,
        options: [
          `Data redundancy and update anomalies`,
          `Faster query execution speeds across all tables`,
          `Automatic backup generation`,
          `Zero storage consumption`
        ],
        answer: `Data redundancy and update anomalies`,
        explanation: `Unnormalized data can lead to duplicated records and anomalies during updates or deletions.`
      },
      {
        id: 'q5',
        question: `What SQL command is used to define a new table structure?`,
        options: [`CREATE TABLE`, `ALTER USER`, `SELECT INTO`, `DROP DATABASE`],
        answer: `CREATE TABLE`,
        explanation: `The CREATE TABLE statement defines the columns, data types, and constraints of a new table.`
      }
    ]
  });
}

/**
 * Connections Generator Fallback
 */
function generateConnectionsFallback(prompt = '') {
  const match = prompt.match(/Compare "(.*?)" and "(.*?)"/i);
  const topicA = match ? match[1] : 'Topic A';
  const topicB = match ? match[2] : 'Topic B';

  const text = `### Comparative Synthesis: ${topicA} vs. ${topicB}

**Core Analysis:**
While **${topicA}** and **${topicB}** serve different domain requirements, both rely on structured database design, entity relationships, and transactional safety to operate reliably.

---

### Key Comparison Dimensions

1. **Entity Structure & Modeling**
   - **${topicA}:** Focuses on domain-specific assets and participant roles.
   - **${topicB}:** Concentrates on workflow transactions and event logs.

2. **Integrity & Constraints**
   - **${topicA}:** Enforces primary and foreign key relationships to prevent orphan records.
   - **${topicB}:** Utilizes timestamps and audit logs to track operational state changes.

---

**Key Takeaway:**
Both systems highlight the importance of relational modeling in ensuring accurate data retrieval and long-term maintainability.`;

  return JSON.stringify({ connection: text, summary: text, text: text });
}

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  const { system, prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const sysStr = (system || '').toLowerCase();
  const promptStr = (prompt || '').toLowerCase();

  if (sysStr.includes('compare') || promptStr.includes('compare')) {
    return res.json({ text: generateConnectionsFallback(prompt) });
  }
  if (sysStr.includes('question') || sysStr.includes('quiz') || promptStr.includes('question')) {
    return res.json({ text: generatePracticeFallback(prompt) });
  }

  // Generate dynamic database schema & SQL code
  const schemaObj = generateDynamicSchema(prompt);
  res.json({ text: JSON.stringify(schemaObj) });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));
