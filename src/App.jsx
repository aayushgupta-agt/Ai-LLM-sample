import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const MODELS = [
  {
    name: "Nvidia Nemotron 3 Nano 30B",
    model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    badge: "NVIDIA",
  },
  {
    name: "Google Gemma 3 27B",
    model: "google/gemma-3-27b-it:free",
    badge: "Google",
  },
  {
    name: "OpenAI GPT-4o mini",
    model: "openai/gpt-4o-mini:free",
    badge: "OpenAI",
  },
  {
    name: "Meta Llama 3.2 3B",
    model: "meta-llama/llama-3.2-3b-instruct:free",
    badge: "Meta",
  },
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].model);
  const [usedModel, setUsedModel] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  const inputRef = useRef(null);
  const answerRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (answer && answerRef.current) {
      answerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [answer]);

  async function searchAI() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    setError("");
    setUsedModel(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel }),
      });
      const data = await response.json();

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      setResponseTime(elapsed);

      if (!response.ok) {
        setError(data?.error || "Request failed. Please try again.");
      } else {
        setAnswer(data.answer || "No response generated.");
        // prefer what the backend confirms it used
        setUsedModel(data.model || selectedModel);
      }
    } catch {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      setResponseTime(elapsed);
      setError("Network error — is the server running?");
    }

    setLoading(false);
  }

  const currentModelLabel =
    MODELS.find((m) => m.model === (usedModel || selectedModel))?.name ||
    usedModel ||
    selectedModel;

  const showResult = loading || answer || error;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex flex-col items-center px-5 pb-28 selection:bg-violet-500/20 selection:text-violet-200">
      {/* Ambient top glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-80 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse at top, #7c3aed, transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #52525b 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, black 30%, transparent 80%)",
        }}
      />

      {/* Header */}
      <header className="w-full max-w-2xl pt-20 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-medium">
            AI · Ready
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-zinc-100 leading-[1.06]">
          Ask anything
        </h1>
        <p className="mt-3.5 text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
          Clear, reasoned answers. No fluff.
        </p>
      </header>

      {/* Main */}
      <div className="w-full max-w-2xl flex flex-col gap-3 relative z-10">
        {/* Model selector */}
        <div className="flex items-center gap-2 px-1 mb-0.5">
          <span className="text-[10.5px] text-zinc-600 shrink-0">Model</span>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={loading}
              className="appearance-none text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-700 focus:outline-none rounded-lg pl-3 pr-7 py-1.5 cursor-pointer transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {MODELS.map((m) => (
                <option key={m.model} value={m.model}>
                  {m.name}
                </option>
              ))}
            </select>
            {/* chevron */}
            <svg
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 w-3 h-3"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Search input */}
        <div className="group relative">
          <div
            className="absolute -inset-px rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed44, #4f46e522, #7c3aed33)",
              filter: "blur(1px)",
            }}
          />
          <div className="relative flex items-center bg-zinc-900 border border-zinc-800 group-focus-within:border-zinc-700 rounded-xl transition-colors duration-200 overflow-hidden">
            {/* Search icon */}
            <span className="pl-4 pr-3 text-zinc-600 shrink-0">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M10.5 10.5L13.5 13.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchAI()}
              placeholder="What do you want to know?"
              className="flex-1 bg-transparent py-4 pr-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none font-light tracking-[0.005em]"
            />

            <button
              onClick={searchAI}
              disabled={loading || !prompt.trim()}
              className="shrink-0 mr-1.5 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-zinc-100 text-xs font-medium tracking-wide transition-all duration-150 active:scale-95"
            >
              {loading ? (
                <svg
                  className="animate-spin w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <>
                  <span>Ask</span>
                  <kbd className="text-zinc-500 text-[10px] font-mono">↵</kbd>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hint row */}
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-[10.5px] text-zinc-600">Press</span>
          <kbd className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded-md">
            Enter
          </kbd>
          <span className="text-[10.5px] text-zinc-600">to send</span>
        </div>

        {/* Answer / error card */}
        {showResult && (
          <div className="mt-2 animate-[fadeUp_0.35s_ease_both]">
            <style>{`
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes shimmer {
                from { background-position: 200% 0; }
                to   { background-position: -200% 0; }
              }
            `}</style>

            {/* Card header: label + metadata */}
            <div className="flex items-center gap-3 mb-3 px-1">
              <span className="text-[10px] tracking-[0.16em] uppercase text-zinc-600 font-medium">
                Response
              </span>
              <div className="flex-1 h-px bg-zinc-800" />

              {/* Metadata pills — show after response lands */}
              {!loading && (usedModel || responseTime) && (
                <div className="flex items-center gap-2">
                  {usedModel && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                      <svg
                        className="w-2.5 h-2.5 text-violet-500"
                        viewBox="0 0 10 10"
                        fill="currentColor"
                      >
                        <circle cx="5" cy="5" r="5" />
                      </svg>
                      {currentModelLabel}
                    </span>
                  )}
                  {responseTime && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                      <svg
                        className="w-2.5 h-2.5 text-emerald-500"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle
                          cx="5"
                          cy="5"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M5 3v2.5l1.5 1"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      {responseTime}s
                    </span>
                  )}
                </div>
              )}
            </div>

            <div
              ref={answerRef}
              className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-7 max-h-[480px] overflow-y-auto scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full"
                style={{
                  background: error
                    ? "linear-gradient(to bottom, #ef444460, #ef444420, transparent)"
                    : "linear-gradient(to bottom, #7c3aed99, #7c3aed33, transparent)",
                }}
              />

              {loading ? (
                <div className="space-y-3 pl-2">
                  {[95, 78, 100, 65, 85, 55, 90].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 rounded-md"
                      style={{
                        width: `${w}%`,
                        animation: `shimmer 1.8s ease infinite`,
                        animationDelay: `${i * 0.1}s`,
                        background:
                          "linear-gradient(90deg, #27272a 30%, #3f3f46 50%, #27272a 70%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="pl-2 flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-red-500 mt-0.5 shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M8 5v3.5M8 11v.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-sm text-red-400 font-light leading-relaxed">
                    {error}
                  </p>
                </div>
              ) : (
                <div className="pl-2 prose-answer">
                  <style>{`
                    .prose-answer { color: #a1a1aa; font-size: 13.5px; font-weight: 300; line-height: 1.85; letter-spacing: 0.006em; }
                    .prose-answer p { margin-bottom: 12px; }
                    .prose-answer p:last-child { margin-bottom: 0; }
                    .prose-answer strong { color: #e4e4e7; font-weight: 500; }
                    .prose-answer em { color: #a78bfa; font-style: italic; }
                    .prose-answer code { font-family: ui-monospace, monospace; font-size: 12px; background: #18181b; color: #a78bfa; padding: 1.5px 6px; border-radius: 5px; border: 1px solid #3f3f46; }
                    .prose-answer pre { background: #18181b; border: 1px solid #3f3f46; border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 14px 0; }
                    .prose-answer pre code { background: none; border: none; padding: 0; color: #a1a1aa; font-size: 12px; }
                    .prose-answer ul, .prose-answer ol { padding-left: 18px; margin-bottom: 12px; }
                    .prose-answer li { margin-bottom: 5px; }
                    .prose-answer h1 { font-size: 18px; font-weight: 500; color: #e4e4e7; margin: 18px 0 9px; letter-spacing: -0.01em; }
                    .prose-answer h2 { font-size: 15px; font-weight: 500; color: #e4e4e7; margin: 16px 0 8px; }
                    .prose-answer h3 { font-size: 13.5px; font-weight: 500; color: #d4d4d8; margin: 14px 0 6px; }
                    .prose-answer blockquote { border-left: 2px solid #52525b; padding-left: 14px; color: #71717a; margin: 12px 0; }
                    .prose-answer a { color: #7c3aed; text-decoration: underline; text-underline-offset: 3px; }
                    .prose-answer hr { border: none; border-top: 1px solid #3f3f46; margin: 16px 0; }
                    .prose-answer table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin: 14px 0; }
                    .prose-answer th { color: #d4d4d8; font-weight: 500; text-align: left; padding: 6px 12px; border-bottom: 1px solid #3f3f46; background: #18181b; }
                    .prose-answer td { padding: 6px 12px; border-bottom: 1px solid #27272a; }
                    .prose-answer tr:last-child td { border-bottom: none; }
                  `}</style>
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 rounded-full px-4 py-2">
          <span className="w-1 h-1 rounded-full bg-violet-500 opacity-60" />
          <span className="text-[10px] text-zinc-600 tracking-wide font-medium">
            Powered by OpenRouter
          </span>
        </div>
      </div>
    </div>
  );
}
