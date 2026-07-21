import React, { useState } from 'react';
import { TOKENS } from '../lib/tokens.js';
import { HelpCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function PracticeTab({ currentDiagram, studyLog = [] }) {
  const defaultTopics = [
    "TCP 3-Way Handshake Protocol",
    "Photosynthesis and Water Cycle",
    "Random Forest Crop Yield Prediction",
    "Hospital Management Relational Database",
    "OAuth 2.0 Authentication Flow"
  ];

  const initialTopic = currentDiagram?.title || studyLog[0]?.title || defaultTopics[0];

  const [topic, setTopic] = useState(initialTopic);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateQuestions = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setQuestions([]);
    setUserAnswers({});
    setSubmitted(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'Generate 5 multiple choice practice questions for the given topic. Return JSON with topic and questions array containing id, question, options, answer, and explanation.',
          prompt: `Generate 5 practice questions about: ${topic}`,
        }),
      });

      const data = await response.json();
      let parsedData = null;

      try {
        parsedData = JSON.parse(data.text);
      } catch {
        parsedData = data;
      }

      const qList = parsedData?.questions || parsedData?.quiz || [];
      if (Array.isArray(qList) && qList.length > 0) {
        setQuestions(qList);
      } else {
        setError('No valid questions were returned. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate practice questions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId, option) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) correct++;
    });
    return correct;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Topic Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle size={20} color={TOKENS.gold} />
          <h2 className="text-lg font-bold" style={{ color: TOKENS.paper }}>
            Practice & Quiz Engine
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[280px] space-y-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Type any study topic..."
              className="w-full p-2.5 rounded-md border text-sm font-medium"
              style={{ background: TOKENS.paper, color: TOKENS.ink, borderColor: TOKENS.line }}
            />
            {studyLog.length > 0 && (
              <select
                onChange={(e) => e.target.value && setTopic(e.target.value)}
                className="w-full p-1.5 rounded text-xs font-medium opacity-80"
                style={{ background: TOKENS.paper, color: TOKENS.ink }}
              >
                <option value="">-- Choose from recent topics --</option>
                {studyLog.map((item, idx) => (
                  <option key={idx} value={item.title}>
                    {item.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={loading || !topic.trim()}
            style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
            className="px-4 py-2.5 rounded-md font-semibold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <Sparkles size={16} />
            {loading ? 'Generating Quiz...' : 'Generate Practice Questions'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="space-y-6 mt-6">
          {questions.map((q, idx) => {
            const selected = userAnswers[q.id];
            const isCorrect = selected === q.answer;

            return (
              <div
                key={q.id || idx}
                style={{ background: TOKENS.paper, borderColor: TOKENS.line }}
                className="p-5 rounded-md border shadow-sm space-y-3"
              >
                <p className="font-semibold text-sm flex items-center justify-between" style={{ color: TOKENS.ink }}>
                  <span>{idx + 1}. {q.question}</span>
                  {!selected && !submitted && (
                    <span className="text-xs text-amber-600 font-normal italic">(Unanswered)</span>
                  )}
                </p>

                <div className="space-y-2 pl-1">
                  {q.options.map((opt, oIdx) => {
                    const isOptionSelected = selected === opt;
                    let optionStyle = {
                      background: 'transparent',
                      borderColor: TOKENS.line,
                      color: TOKENS.ink,
                    };

                    if (submitted) {
                      if (opt === q.answer) {
                        optionStyle = { background: '#dcfce7', borderColor: '#22c55e', color: '#15803d' };
                      } else if (isOptionSelected && !isCorrect) {
                        optionStyle = { background: '#fee2e2', borderColor: '#ef4444', color: '#b91c1c' };
                      }
                    } else if (isOptionSelected) {
                      optionStyle = { background: TOKENS.gold + '44', borderColor: TOKENS.gold, color: TOKENS.ink };
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(q.id, opt)}
                        style={optionStyle}
                        className="w-full text-left p-2.5 rounded border text-sm font-medium transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>{opt}</span>
                        {submitted && opt === q.answer && <CheckCircle2 size={16} className="text-green-600" />}
                        {submitted && isOptionSelected && !isCorrect && <XCircle size={16} className="text-red-600" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <p className="text-xs pt-2 border-t mt-3 italic" style={{ color: TOKENS.inkSoft, borderColor: TOKENS.line + '44' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            );
          })}

          {/* Submission & Score Summary */}
          <div className="pt-2 flex items-center justify-between">
            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                style={{ background: TOKENS.gold, color: TOKENS.blueprintDeep }}
                className="px-5 py-2.5 rounded-md font-bold text-sm hover:opacity-90 cursor-pointer"
              >
                Submit Answers ({Object.keys(userAnswers).length}/{questions.length} answered)
              </button>
            ) : (
              <div className="p-4 rounded-md w-full flex items-center justify-between border" style={{ background: TOKENS.paper, borderColor: TOKENS.line }}>
                <span className="font-bold text-base" style={{ color: TOKENS.ink }}>
                  Your Score: {calculateScore()} / {questions.length}
                </span>
                <button
                  onClick={handleGenerateQuestions}
                  className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
                  style={{ background: TOKENS.blueprintDeep, color: TOKENS.paper }}
                >
                  Try New Questions
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
