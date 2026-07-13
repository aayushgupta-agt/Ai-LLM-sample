import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
const SUGGESTED = [
  "How does transformer attention work?",
  "What is the difference between RAG and fine-tuning?",
  "Explain quantum entanglement simply",
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState("");
  const [model, setModel] = useState("Nvidia");
  const inputRef = useRef(null);

  const API_URL =  "http://localhost:3001";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function searchAI(text) {
    const query = text ?? prompt;
    if (!query.trim()) return;
    setAsked(query);
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await response.json();
      const {model} = data;
      const name = model.split("/")[0];
      setModel(name);
      setAnswer(data.answer);
    } catch {
      setAnswer("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function handleSuggestion(s) {
    setPrompt(s);
    searchAI(s);
  }

  const showResult = loading || answer;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col items-center px-5 pb-24">

      {/* ── Subtle top glow ── */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-30"
        style={{
          background: "radial-gradient(ellipse 60% 100% at 50% 0%, #3b82f620, transparent)",
        }}
        aria-hidden
      />

      {/* ── Header ── */}
      <header className="w-full max-w-2xl pt-20 pb-12 text-center">
        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-blue-400 font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          AI · Ready
        </span>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-100 leading-[1.1]">
          Ask anything
        </h1>
        <p className="mt-3 text-sm text-zinc-500 font-normal leading-relaxed max-w-sm mx-auto">
          A direct line to the model — type a question and get a clear, structured answer.
        </p>
      </header>

      {/* ── Search bar ── */}
      <div className="w-full max-w-2xl">
        <div className="flex items-stretch rounded-xl border border-zinc-800 bg-zinc-900 ring-0 transition-all duration-200 focus-within:border-zinc-600 focus-within:ring-2 focus-within:ring-blue-500/10">
          {/* Icon */}
          <div className="flex items-center pl-4 pr-3 text-zinc-600 flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchAI()}
            placeholder="Ask a question…"
            className="flex-1 bg-transparent border-none outline-none py-4 pr-3 text-sm text-zinc-200 placeholder-zinc-600 font-light"
          />

          {/* Button */}
          <button
            onClick={() => searchAI()}
            disabled={loading || !prompt.trim()}
            className="flex-shrink-0 flex items-center gap-1.5 px-5 border-l border-zinc-800 text-xs font-semibold tracking-wide text-blue-400 transition-all duration-150 hover:bg-blue-500/5 disabled:text-zinc-600 disabled:cursor-not-allowed rounded-r-xl"
          >
            {loading ? (
              <span className="w-3 h-3 rounded-full border border-zinc-600 border-t-blue-400 animate-spin block" />
            ) : (
              <>
                Ask
                <span className="text-zinc-600 group-hover:translate-x-0.5 transition-transform">→</span>
              </>
            )}
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="mt-2.5 text-[11px] text-zinc-600 flex items-center gap-1.5 pl-1">
          Press
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 border border-zinc-800 rounded text-zinc-500 bg-zinc-900">
            Enter
          </kbd>
          to send
        </p>
      </div>

      {/* ── Suggestions (shown before any search) ── */}
      {!showResult && (
        <div className="w-full max-w-2xl mt-8">
          <p className="text-[11px] text-zinc-600 tracking-widest uppercase mb-3 pl-0.5">
            Try asking
          </p>
          <div className="flex flex-col gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="text-left text-sm text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-4 py-3 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900 transition-all duration-150"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Answer area ── */}
      {showResult && (
        <div className="w-full max-w-2xl mt-8 animate-[fadeUp_0.35s_ease_both]">
          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
              response
            </span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Question echo */}
          {asked && (
            <p className="text-xs text-zinc-500 mb-4 pl-1">
              <span className="text-zinc-600">Q:</span>{" "}
              <span className="text-zinc-400">{asked}</span>
            </p>
          )}

          {/* Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
            {/* Card top bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800/70">
              <div className="w-2 h-2 rounded-full bg-blue-500/60" />
              <span className="text-[11px] font-mono text-zinc-600 tracking-wider">
                {model ? `Model: ${model.toUpperCase()} · ` : ""}
              </span>
            </div>

            {/* Body */}
            <div className="px-5 py-5">
              {loading ? (
                <div className="space-y-3">
                  {[95, 80, 90, 65, 50].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 rounded-full bg-zinc-800 animate-pulse"
                      style={{
                        width: `${w}%`,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="prose prose-sm prose-invert max-w-none
                  prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:font-light
                  prose-strong:text-zinc-100 prose-strong:font-semibold
                  prose-em:text-blue-300/80
                  prose-code:text-blue-300 prose-code:bg-zinc-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:border prose-code:border-zinc-800 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg
                  prose-headings:text-zinc-100 prose-headings:font-semibold
                  prose-blockquote:border-l-blue-500/40 prose-blockquote:text-zinc-400
                  prose-li:text-zinc-300 prose-li:leading-relaxed prose-li:font-light
                  prose-ul:pl-5 prose-ol:pl-5
                ">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Follow-up hint */}
          {answer && !loading && (
            <p className="mt-4 text-xs text-zinc-600 pl-1">
              Type another question above to continue.
            </p>
          )}
        </div>
      )}

      {/* ── Keyframe for answer fade-up ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}