import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./index.css";

const SUGGESTED_QUESTIONS = [
  "Who won the 2024 F1 World Championship?",
  "Explain DRS in simple terms",
  "Compare Hamilton vs Verstappen",
  "What is the fastest F1 circuit?",
];

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm **F1GPT** 🏎️ Ask me anything about Formula 1 — drivers, teams, races, rules, history, and more!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    const userMessage = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/chat", {
        message: userText,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Make sure the server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.logo}>🏎️ F1GPT</span>
        <span style={styles.subtitle}>Your Formula 1 AI Expert</span>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageBubble,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#e10600" : "#1a1a1a",
              maxWidth: "75%",
            }}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.messageBubble, background: "#1a1a1a", alignSelf: "flex-start" }}>
            <span style={styles.typing}>F1GPT is thinking</span>
            <span style={styles.dots}>...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div style={styles.suggestions}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button key={i} style={styles.chip} onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={styles.inputRow}>
        <textarea
          style={styles.textarea}
          placeholder="Ask about F1..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    borderBottom: "1px solid #222",
    background: "#111",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#e10600",
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "#888",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageBubble: {
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "0.95rem",
    lineHeight: "1.6",
  },
  typing: {
    color: "#888",
    fontSize: "0.9rem",
  },
  dots: {
    color: "#e10600",
    fontWeight: "bold",
  },
  suggestions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "0 20px 12px",
  },
  chip: {
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "#ccc",
    padding: "8px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    padding: "16px 20px",
    borderTop: "1px solid #222",
    background: "#111",
  },
  textarea: {
    flex: 1,
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#fff",
    fontSize: "0.95rem",
    resize: "none",
    outline: "none",
  },
  sendBtn: {
    background: "#e10600",
    border: "none",
    borderRadius: "10px",
    padding: "0 20px",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
};