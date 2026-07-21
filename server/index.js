import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

/**
 * Smart Fallback Engine: Builds comprehensive multi-table schemas and full SQL DDL scripts.
 */
function generateSmartDiagram(prompt = '') {
  const query = prompt.toLowerCase();

  // 1. Hospital Management System
  if (query.includes('hospital') || query.includes('patient') || query.includes('doctor')) {
    return JSON.stringify({
      title: "Hospital Management System Architecture",
      type: "schema",
      nodes: [
        { id: "patients", label: "Patients Table", detail: ["Patient_ID (PK)", "Full_Name", "DOB", "Phone", "Created_At"] },
        { id: "doctors", label: "Doctors Table", detail: ["Doctor_ID (PK)", "Name", "Specialty", "Email", "Department_ID"] },
        { id: "appointments", label: "Appointments Table", detail: ["Appointment_ID (PK)", "Patient_ID (FK)", "Doctor_ID (FK)", "Appointment_Date", "Status"] },
        { id: "records", label: "Medical Records Table", detail: ["Record_ID (PK)", "Patient_ID (FK)", "Doctor_ID (FK)", "Diagnosis", "Treatment_Plan", "Prescription"] },
        { id: "bills", label: "Billing & Invoices Table", detail: ["Bill_ID (PK)", "Patient_ID (FK)", "Total_Amount", "Payment_Status", "Issue_Date"] }
      ],
      edges: [
        { from: "patients", to: "appointments", label: "schedules" },
        { from: "doctors", to: "appointments", label: "conducts" },
        { from: "patients", to: "records", label: "has clinical history" },
        { from: "doctors", to: "records", label: "prescribes" },
        { from: "patients", to: "bills", label: "billed for service" }
      ],
      rationale: [
        "Normalizes patient demographics away from transactional clinical visits.",
        "Uses Appointments as a junction table coordinating Doctor availability and Patient slots.",
        "Establishes separate Medical Records and Billing tables to enforce HIPAA data privacy role boundaries."
      ],
      code: {
        language: "sql",
        content: `-- Complete Multi-Table Schema for Hospital Management
CREATE TABLE Patients (
  Patient_ID INT PRIMARY KEY AUTO_INCREMENT,
  Full_Name VARCHAR(100) NOT NULL,
  DOB DATE NOT NULL,
  Phone VARCHAR(20),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Doctors (
  Doctor_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Specialty VARCHAR(50) NOT NULL,
  Email VARCHAR(100) UNIQUE,
  Department_ID INT
);

CREATE TABLE Appointments (
  Appointment_ID INT PRIMARY KEY AUTO_INCREMENT,
  Patient_ID INT NOT NULL,
  Doctor_ID INT NOT NULL,
  Appointment_Date DATETIME NOT NULL,
  Status VARCHAR(20) DEFAULT 'Scheduled',
  FOREIGN KEY (Patient_ID) REFERENCES Patients(Patient_ID) ON DELETE CASCADE,
  FOREIGN KEY (Doctor_ID) REFERENCES Doctors(Doctor_ID) ON DELETE RESTRICT
);

CREATE TABLE Medical_Records (
  Record_ID INT PRIMARY KEY AUTO_INCREMENT,
  Patient_ID INT NOT NULL,
  Doctor_ID INT NOT NULL,
  Diagnosis TEXT NOT NULL,
  Treatment_Plan TEXT,
  Prescription TEXT,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Patient_ID) REFERENCES Patients(Patient_ID) ON DELETE CASCADE,
  FOREIGN KEY (Doctor_ID) REFERENCES Doctors(Doctor_ID) ON DELETE RESTRICT
);

CREATE TABLE Billing (
  Bill_ID INT PRIMARY KEY AUTO_INCREMENT,
  Patient_ID INT NOT NULL,
  Total_Amount DECIMAL(10,2) NOT NULL,
  Payment_Status VARCHAR(20) DEFAULT 'Pending',
  Issue_Date DATE NOT NULL,
  FOREIGN KEY (Patient_ID) REFERENCES Patients(Patient_ID) ON DELETE CASCADE
);`
      }
    });
  }

  // 2. Library Management System
  if (query.includes('library') || query.includes('book') || query.includes('borrow')) {
    return JSON.stringify({
      title: "Library Management System Architecture",
      type: "schema",
      nodes: [
        { id: "members", label: "Members Table", detail: ["Member_ID (PK)", "Name", "Email", "Join_Date"] },
        { id: "books", label: "Books Table", detail: ["ISBN (PK)", "Title", "Author", "Publisher", "Copies_Available"] },
        { id: "loans", label: "Loans Table", detail: ["Loan_ID (PK)", "Member_ID (FK)", "ISBN (FK)", "Issue_Date", "Due_Date"] },
        { id: "fines", label: "Fines Table", detail: ["Fine_ID (PK)", "Loan_ID (FK)", "Amount", "Paid_Status"] }
      ],
      edges: [
        { from: "members", to: "loans", label: "borrows" },
        { from: "books", to: "loans", label: "checked out in" },
        { from: "loans", to: "fines", label: "incurs" }
      ],
      rationale: [
        "Separates physical book inventory from member account activity.",
        "Loans table records active borrowing states with due date constraints.",
        "Fines link directly to Loan transactions for explicit auditability."
      ],
      code: {
        language: "sql",
        content: `-- Complete Multi-Table Schema for Library Management
CREATE TABLE Members (
  Member_ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) UNIQUE NOT NULL,
  Join_Date DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE Books (
  ISBN VARCHAR(20) PRIMARY KEY,
  Title VARCHAR(255) NOT NULL,
  Author VARCHAR(100) NOT NULL,
  Publisher VARCHAR(100),
  Copies_Available INT DEFAULT 1 CHECK (Copies_Available >= 0)
);

CREATE TABLE Loans (
  Loan_ID INT PRIMARY KEY AUTO_INCREMENT,
  Member_ID INT NOT NULL,
  ISBN VARCHAR(20) NOT NULL,
  Issue_Date DATE DEFAULT (CURRENT_DATE),
  Due_Date DATE NOT NULL,
  Return_Date DATE,
  FOREIGN KEY (Member_ID) REFERENCES Members(Member_ID),
  FOREIGN KEY (ISBN) REFERENCES Books(ISBN)
);

CREATE TABLE Fines (
  Fine_ID INT PRIMARY KEY AUTO_INCREMENT,
  Loan_ID INT NOT NULL,
  Amount DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  Paid_Status BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (Loan_ID) REFERENCES Loans(Loan_ID)
);`
      }
    });
  }

  // 3. Generic Multi-Table Fallback for any other prompt
  const cleanTitle = prompt.trim() ? prompt.slice(0, 40) : 'System';
  const entityName = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  return JSON.stringify({
    title: `${entityName} Architecture Schema`,
    type: "schema",
    nodes: [
      { id: "users", label: "Users Table", detail: ["User_ID (PK)", "Username", "Email", "Password_Hash", "Role"] },
      { id: "resources", label: `${entityName} Records Table`, detail: ["Resource_ID (PK)", "User_ID (FK)", "Title", "Status", "Created_At"] },
      { id: "activity_logs", label: "Audit Logs Table", detail: ["Log_ID (PK)", "User_ID (FK)", "Resource_ID (FK)", "Action", "Timestamp"] }
    ],
    edges: [
      { from: "users", to: "resources", label: "manages" },
      { from: "users", to: "activity_logs", label: "performs" },
      { from: "resources", to: "activity_logs", label: "logs changes" }
    ],
    rationale: [
      "Establishes Third Normal Form (3NF) compliance across operational tables.",
      "Implements Foreign Keys with CASCADE / RESTRICT rules for referential integrity.",
      "Maintains audit logs to track entity modifications over time."
    ],
    code: {
      language: "sql",
      content: `-- Complete Multi-Table Schema Structure
CREATE TABLE Users (
  User_ID INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(50) UNIQUE NOT NULL,
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password_Hash VARCHAR(255) NOT NULL,
  Role VARCHAR(20) DEFAULT 'Standard'
);

CREATE TABLE Resources (
  Resource_ID INT PRIMARY KEY AUTO_INCREMENT,
  User_ID INT NOT NULL,
  Title VARCHAR(150) NOT NULL,
  Status VARCHAR(30) DEFAULT 'Active',
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

CREATE TABLE Audit_Logs (
  Log_ID INT PRIMARY KEY AUTO_INCREMENT,
  User_ID INT NOT NULL,
  Resource_ID INT NOT NULL,
  Action VARCHAR(50) NOT NULL,
  Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
  FOREIGN KEY (Resource_ID) REFERENCES Resources(Resource_ID) ON DELETE CASCADE
);`
    }
  });
}

app.post('/api/generate', async (req, res) => {
  const { system, prompt, maxTokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" in request body' });
  }

  // If no API key is present, output full smart mock schema directly
  if (!process.env.OPENAI_API_KEY) {
    return res.json({ text: generateSmartDiagram(prompt) });
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
          { role: 'system', content: system || 'Return complete JSON with multi-table DDL SQL scripts in code.content.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API status exception:', response.status);
      return res.json({ text: generateSmartDiagram(prompt) });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const cleanText = text.replace(/```json|```/g, '').trim();

    res.json({ text: cleanText });

  } catch (err) {
    console.error('Server error:', err.message);
    res.json({ text: generateSmartDiagram(prompt) });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Cortex server listening on http://localhost:${PORT}`));