import { useState } from "react";

function AskAIComponent() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("https://notesai-ten.vercel.app/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: question }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the AI answer.");
      }

      const data = await response.json();
      setAnswer(data["AI Answer"]);
    } catch (err) {
      setError(`Error fetching AI response: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ask the AI</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleAsk} disabled={loading || !question.trim()}>
        {loading ? "Asking..." : "Ask AI"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {answer && (
        <div>
          <h2>AI Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AskAIComponent;
