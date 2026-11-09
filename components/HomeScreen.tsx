"use client";

import { useStore, type AppId } from "./store";

export const APPS: { id: AppId; label: string; emoji: string; bg: string; blurb: string }[] = [
  { id: "explore", label: "Explore", emoji: "🔭", bg: "linear-gradient(135deg,#ff6b9d,#ff9a44)", blurb: "Participant journey on Android & iOS" },
  { id: "sandbox", label: "Sandbox", emoji: "🧪", bg: "linear-gradient(135deg,#4facfe,#00c6ff)", blurb: "Build & run agents live" },
  { id: "learn", label: "Learn Lab", emoji: "🧬", bg: "linear-gradient(135deg,#a18cd1,#7c4dff)", blurb: "RAG · MCP · Orchestration" },
  { id: "industry", label: "Industry", emoji: "🏭", bg: "linear-gradient(135deg,#f6d365,#fda085)", blurb: "10 industrial scenarios" },
  { id: "toolkit", label: "Toolkit", emoji: "🧰", bg: "linear-gradient(135deg,#43e97b,#00b894)", blurb: "Tools, frameworks, platforms" },
  { id: "assistant", label: "AI Buddy", emoji: "🤖", bg: "linear-gradient(135deg,#f093fb,#f5576c)", blurb: "Groq-powered assistant" },
  { id: "settings", label: "Settings", emoji: "⚙️", bg: "linear-gradient(135deg,#8e9eab,#5f6c7b)", blurb: "BYOK & device" },
];

export function HomeScreen() {
  const { open, groqKey, device } = useStore();
  const now = new Date();
  const hour = now.getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const grid = APPS.filter((a) => !["sandbox", "assistant", "learn", "settings"].includes(a.id));
  const dock = APPS.filter((a) => ["sandbox", "assistant", "learn", "settings"].includes(a.id));

  return (
    <div className="home">
      <div className="widget hero-widget">
        <div className="hero-date">{now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</div>
        <div className="hero-title">{greet}, builder 👋</div>
        <div className="hero-sub">Create AI agents right from your {device === "ios" ? "iPhone" : "Android phone"}.</div>
        <div className="hero-chips">
          <span>🧠 Agents</span>
          <span>📚 RAG</span>
          <span>🔌 MCP</span>
          <span>🎼 Orchestration</span>
        </div>
      </div>

      <div className="widget-row">
        <button className="widget small" onClick={() => open("settings")} style={{ background: groqKey ? "linear-gradient(135deg,#00b894,#55efc4)" : "linear-gradient(135deg,#ff7675,#fd79a8)" }}>
          <div className="w-big">{groqKey ? "🔓" : "🔑"}</div>
          <div className="w-label">{groqKey ? "Groq key ready" : "Add Groq key"}</div>
          <div className="w-sub">BYOK · stays on device</div>
        </button>
        <button className="widget small" onClick={() => open("industry")} style={{ background: "linear-gradient(135deg,#6c5ce7,#a29bfe)" }}>
          <div className="w-big">10</div>
          <div className="w-label">Industry labs</div>
          <div className="w-sub">Tap to try one</div>
        </button>
      </div>

      <div className="app-grid">
        {grid.map((a, i) => (
          <button key={a.id} className="app-icon" style={{ animationDelay: `${i * 40}ms` }} onClick={() => open(a.id)}>
            <span className="icon" style={{ background: a.bg }}>{a.emoji}</span>
            <span className="label">{a.label}</span>
          </button>
        ))}
        <button className="app-icon" onClick={() => open("learn")} style={{ animationDelay: "160ms" }}>
          <span className="icon folder">
            <span>📚</span><span>🔌</span><span>🎼</span><span>🛡️</span>
          </span>
          <span className="label">Modules</span>
        </button>
      </div>

      <div className="widget tip-widget">
        <b>💡 Today&apos;s challenge</b>
        <p>Pick the Manufacturing scenario, run it with <i>ReAct</i>, then with <i>Supervisor</i>. Which made fewer tool calls?</p>
      </div>

      <div className="dock">
        {dock.map((a) => (
          <button key={a.id} className="app-icon" onClick={() => open(a.id)} aria-label={a.label}>
            <span className="icon" style={{ background: a.bg }}>{a.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
