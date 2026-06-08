import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600&family=JetBrains+Mono:wght@300;400&display=swap');

  :root {
    --bg:        #0d1117;
    --surface:   #131920;
    --border:    #1e2a35;
    --border-hi: #2e4a60;
    --text:      #cdd6e0;
    --text-muted:#4a6070;
    --text-dim:  #2a3a48;
    --accent:    #4fa8d5;
    --accent-lo: #4fa8d518;
    --accent-md: #4fa8d540;
    --glow:      #4fa8d508;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    font-family: 'Sora', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Grid overlay ─────────────────────────── */
  .grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 80%);
    opacity: 0.35;
  }

  /* ── Ambient glow ─────────────────────────── */
  .glow-top {
    position: fixed;
    top: -120px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(ellipse, #4fa8d514 0%, #1a6a9a0a 40%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: pulse 6s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; transform: translateX(-50%) scaleX(1); }
    50%       { opacity: 1;   transform: translateX(-50%) scaleX(1.1); }
  }

  /* ── Shell ────────────────────────────────── */
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px 100px;
    position: relative;
    z-index: 1;
  }

  /* ── Header ───────────────────────────────── */
  .header {
    width: 100%;
    max-width: 720px;
    padding: 80px 0 52px;
    text-align: center;
    animation: riseIn 0.8s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes riseIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 10.5px;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 24px;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: blink 2.4s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .header-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(38px, 6vw, 64px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #e8f0f7;
  }

  .header-title .dim { color: var(--text-muted); font-weight: 300; }

  .header-desc {
    margin-top: 16px;
    font-size: 13px;
    font-weight: 300;
    color: var(--text-muted);
    letter-spacing: 0.01em;
    line-height: 1.6;
  }

  /* ── Search ───────────────────────────────── */
  .search-wrap {
    width: 100%;
    max-width: 720px;
    animation: riseIn 0.8s 0.12s cubic-bezier(0.16,1,0.3,1) both;
  }

  .search-field {
    display: flex;
    align-items: stretch;
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 10px;
    overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s;
  }

  .search-field:focus-within {
    border-color: var(--border-hi);
    box-shadow: 0 0 0 3px var(--accent-lo), 0 12px 48px #00000055;
  }

  .search-icon {
    display: flex;
    align-items: center;
    padding: 0 16px 0 20px;
    color: var(--text-dim);
    flex-shrink: 0;
  }

  .search-icon svg { display: block; }

  .search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 18px 12px 18px 0;
    font-family: 'Sora', sans-serif;
    font-size: 14.5px;
    font-weight: 300;
    color: var(--text);
    letter-spacing: 0.01em;
    caret-color: var(--accent);
  }

  .search-input::placeholder { color: var(--text-dim); }

  .search-btn {
    flex-shrink: 0;
    border: none;
    border-left: 1px solid var(--border);
    background: transparent;
    padding: 0 24px;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .search-btn:hover:not(:disabled) { background: var(--accent-lo); }
  .search-btn:disabled { color: var(--text-dim); cursor: not-allowed; }

  .arrow { transition: transform 0.2s; }
  .search-btn:hover:not(:disabled) .arrow { transform: translateX(3px); }

  .hint {
    margin-top: 10px;
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .kbd {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    padding: 2px 7px;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-muted);
    background: var(--surface);
  }

  /* ── Divider ──────────────────────────────── */
  .divider {
    width: 100%;
    max-width: 720px;
    margin-top: 44px;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .divider.visible { opacity: 1; }
  .div-line { flex: 1; height: 1px; background: var(--border); }
  .div-label {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-dim);
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Answer card ──────────────────────────── */
  .answer-card {
    width: 100%;
    max-width: 720px;
    margin-top: 24px;
    animation: riseIn 0.5s ease both;
  }

  .card-inner {
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 10px;
    padding: 28px 32px 32px;
    position: relative;
    overflow: hidden;
  }

  .card-inner::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent-lo) 0%, transparent 50%);
    pointer-events: none;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .card-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent);
    opacity: 0.7;
  }

  .card-line { flex: 1; height: 1px; background: var(--border); }

  /* Markdown styles */
  .md-body { color: var(--text); font-size: 14px; font-weight: 300; line-height: 1.8; letter-spacing: 0.01em; }
  .md-body p { margin-bottom: 14px; }
  .md-body p:last-child { margin-bottom: 0; }
  .md-body strong { color: #e8f0f7; font-weight: 600; }
  .md-body em { color: #9abfd4; }
  .md-body code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    background: #0d1117;
    color: #7dd3f0;
    padding: 2px 7px;
    border-radius: 4px;
    border: 1px solid var(--border);
  }
  .md-body pre {
    background: #0d1117;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 18px 20px;
    overflow-x: auto;
    margin: 16px 0;
  }
  .md-body pre code { background: none; border: none; padding: 0; color: #9abfd4; }
  .md-body ul, .md-body ol { padding-left: 20px; margin-bottom: 14px; }
  .md-body li { margin-bottom: 6px; }
  .md-body h1, .md-body h2, .md-body h3 {
    color: #e8f0f7;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 20px 0 10px;
  }
  .md-body h1 { font-size: 20px; }
  .md-body h2 { font-size: 17px; }
  .md-body h3 { font-size: 15px; }
  .md-body blockquote {
    border-left: 2px solid var(--accent-md);
    padding-left: 16px;
    color: var(--text-muted);
    margin: 14px 0;
  }

  /* ── Skeleton ─────────────────────────────── */
  .skeleton { display: flex; flex-direction: column; gap: 11px; }
  .skel {
    height: 13px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--border) 25%, #1e2e3d 50%, var(--border) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* ── Spinner ──────────────────────────────── */
  .spinner {
    width: 13px; height: 13px;
    border: 1.5px solid var(--border-hi);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/chat";

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function searchAI() {
    if (!prompt.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch {
      setAnswer("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  const showResult = loading || answer;

  return (
    <>
      <style>{styles}</style>
      <div className="grid-bg" />
      <div className="glow-top" />

      <div className="app-shell">

        <header className="header">
          <div className="header-badge">
            <span className="badge-dot" />
            LLM Interface · Active
          </div>
          <h1 className="header-title">
            What do you<br />
            <span className="dim">want to know?</span>
          </h1>
          <p className="header-desc">
            Ask any question. The model will reason through it and respond with a clear, structured answer.
          </p>
        </header>

        <div className="search-wrap">
          <div className="search-field">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => e.key === "Enter" && searchAI()}
            />
            <button className="search-btn" onClick={searchAI} disabled={loading}>
              {loading
                ? <span className="spinner" />
                : <><span>Ask</span><span className="arrow">→</span></>
              }
            </button>
          </div>
          <div className="hint">
            Press <span className="kbd">Enter</span> to send
          </div>
        </div>

        <div className={`divider ${showResult ? "visible" : ""}`}>
          <div className="div-line" />
          <span className="div-label">response</span>
          <div className="div-line" />
        </div>

        {showResult && (
          <div className="answer-card">
            <div className="card-inner">
              <div className="card-header">
                <span className="card-tag">model · output</span>
                <div className="card-line" />
              </div>
              {loading ? (
                <div className="skeleton">
                  {[92, 100, 78, 88, 55].map((w, i) => (
                    <div key={i} className="skel" style={{ width: `${w}%`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
              ) : (
                <div className="md-body">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}