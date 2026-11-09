"use client";

import { useEffect, useRef, useState } from "react";
import { AppHeader, KeyBanner, Markdown, Tabs } from "../ui";
import { useStore } from "../store";
import { TOOL_META } from "@/lib/agent/tools";
import { SCENARIOS } from "@/lib/data/scenarios";
import type { AgentConfig, Pattern, TraceEvent } from "@/lib/agent/framework";
import { runAgentApi } from "@/lib/client";

const PATTERNS: { id: Pattern; label: string; emoji: string; desc: string }[] = [
  { id: "react", label: "ReAct", emoji: "🔁", desc: "One agent loops: think → tool → observe" },
  { id: "plan_execute", label: "Plan & Execute", emoji: "🗺️", desc: "Planner writes steps, executor runs each" },
  { id: "supervisor", label: "Supervisor", emoji: "👑", desc: "Manager delegates to Researcher / Analyst / Operator" },
  { id: "reflection", label: "Reflection", emoji: "🪞", desc: "Draft → critic review → revise" },
];

const TYPE_STYLE: Record<TraceEvent["type"], { icon: string; cls: string }> = {
  agent: { icon: "🤖", cls: "t-agent" },
  thought: { icon: "💭", cls: "t-thought" },
  tool_call: { icon: "🔧", cls: "t-tool" },
  tool_result: { icon: "📥", cls: "t-result" },
  mcp: { icon: "🔌", cls: "t-mcp" },
  plan: { icon: "🗺️", cls: "t-plan" },
  route: { icon: "🧭", cls: "t-plan" },
  critique: { icon: "🧐", cls: "t-critique" },
  final: { icon: "✅", cls: "t-final" },
  error: { icon: "⚠️", cls: "t-error" },
};

const DEFAULT: AgentConfig = {
  name: "MyFirstAgent",
  instructions: "You are a helpful, concise assistant. Use tools when helpful and explain your reasoning briefly.",
  tools: ["calculator", "knowledge_search", "get_datetime"],
  pattern: "react",
  maxSteps: 5,
};

interface Run {
  task: string;
  answer: string;
  trace: TraceEvent[];
  ms: number;
  pattern: Pattern;
  error?: string;
}

type SpeechRec = { lang: string; interimResults: boolean; onresult: (e: any) => void; onend: () => void; start: () => void; stop: () => void };

export function Sandbox() {
  const { groqKey, model, prefill, clearPrefill, notify } = useStore();
  const [cfg, setCfg] = useState<AgentConfig>(DEFAULT);
  const [task, setTask] = useState("What is 18% GST on 42,500 rupees, and what does error E-217 mean on our CNC machines?");
  const [tab, setTab] = useState<"build" | "run" | "trace">("build");
  const [busy, setBusy] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRec | null>(null);

  useEffect(() => {
    if (prefill) {
      setCfg({ name: prefill.agentName, instructions: prefill.instructions, tools: prefill.tools, pattern: prefill.pattern, maxSteps: 5 });
      setTask(prefill.task);
      setTab("run");
      notify(`Loaded ${prefill.emoji} ${prefill.agentName}`);
      clearPrefill();
    }
  }, [prefill, clearPrefill, notify]);

  const last = runs[0];

  async function run() {
    if (!groqKey) return notify("Add your Groq key in Settings first 🔑");
    if (!task.trim()) return;
    setBusy(true);
    setTab("run");
    const history = runs
      .slice(0, 2)
      .reverse()
      .flatMap((r) => [
        { role: "user" as const, content: r.task },
        { role: "assistant" as const, content: r.answer },
      ]);
    try {
      const res = await runAgentApi(groqKey, { ...cfg, model }, task, history);
      const err = res.trace.find((t) => t.type === "error")?.content;
      setRuns([{ task, ...res, pattern: cfg.pattern, error: err }, ...runs].slice(0, 10));
    } catch (e) {
      setRuns([{ task, answer: "", trace: [], ms: 0, pattern: cfg.pattern, error: (e as Error).message }, ...runs]);
    } finally {
      setBusy(false);
    }
  }

  function toggleTool(name: string) {
    setCfg((c) => ({ ...c, tools: c.tools.includes(name) ? c.tools.filter((t) => t !== name) : [...c.tools, name] }));
  }

  function mic() {
    const W = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
    const SR = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!SR) return notify("Voice input not supported in this browser");
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.onresult = (e: any) => setTask((t) => (t ? t + " " : "") + e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  function exportCfg() {
    const json = JSON.stringify({ ...cfg, model, framework: "PocketAgent", provider: "groq" }, null, 2);
    navigator.clipboard?.writeText(json).then(() => notify("Agent JSON copied 📋"), () => notify("Copy failed"));
  }

  const toolCalls = last?.trace.filter((t) => t.type === "tool_call").length ?? 0;
  const mcpCalls = last?.trace.filter((t) => t.type === "mcp").length ?? 0;

  return (
    <div className="app">
      <AppHeader
        title="Sandbox"
        subtitle="Build, run & inspect agents — right on your phone"
        color="#00c6ff"
        right={<button className="pill" onClick={exportCfg}>⇪ Export</button>}
      />
      <KeyBanner />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "build", label: "① Build" },
          { id: "run", label: "② Run" },
          { id: "trace", label: `③ Trace${last ? ` (${last.trace.length})` : ""}` },
        ]}
      />

      {tab === "build" && (
        <div className="stack">
          <label className="field">
            <span>Load an industry scenario</span>
            <select
              defaultValue=""
              onChange={(e) => {
                const s = SCENARIOS.find((x) => x.id === e.target.value);
                if (s) {
                  setCfg({ name: s.agentName, instructions: s.instructions, tools: s.tools, pattern: s.pattern, maxSteps: 5 });
                  setTask(s.task);
                  notify(`Loaded ${s.emoji} ${s.agentName}`);
                }
              }}
            >
              <option value="" disabled>Choose…</option>
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>{s.emoji} {s.industry} — {s.agentName}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Agent name</span>
            <input value={cfg.name} onChange={(e) => setCfg({ ...cfg, name: e.target.value })} />
          </label>
          <label className="field">
            <span>Instructions (role · goal · guardrails)</span>
            <textarea rows={5} value={cfg.instructions} onChange={(e) => setCfg({ ...cfg, instructions: e.target.value })} />
          </label>

          <div className="field">
            <span>Tools <small className="muted">({cfg.tools.length} on)</small></span>
            <div className="tool-grid">
              {TOOL_META.map((t) => (
                <button key={t.name} className={`tool-chip ${cfg.tools.includes(t.name) ? "on" : ""} ${t.kind}`} onClick={() => toggleTool(t.name)}>
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                  {t.kind === "mcp" && <em>MCP</em>}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span>Orchestration pattern</span>
            <div className="pattern-grid">
              {PATTERNS.map((p) => (
                <button key={p.id} className={`pattern ${cfg.pattern === p.id ? "on" : ""}`} onClick={() => setCfg({ ...cfg, pattern: p.id })}>
                  <span className="p-emoji">{p.emoji}</span>
                  <b>{p.label}</b>
                  <small>{p.desc}</small>
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span>Max steps: {cfg.maxSteps}</span>
            <input type="range" min={1} max={8} value={cfg.maxSteps} onChange={(e) => setCfg({ ...cfg, maxSteps: +e.target.value })} />
          </label>

          <button className="cta" onClick={() => setTab("run")}>Next: give it a task →</button>
        </div>
      )}

      {tab === "run" && (
        <div className="stack">
          <div className="agent-badge">
            <span className="ab-emoji">🤖</span>
            <div>
              <b>{cfg.name}</b>
              <small className="muted block">
                {PATTERNS.find((p) => p.id === cfg.pattern)?.label} · {cfg.tools.length} tools · {model}
              </small>
            </div>
          </div>
          <div className="composer">
            <textarea rows={4} value={task} onChange={(e) => setTask(e.target.value)} placeholder="Describe the task for your agent…" />
            <div className="composer-row">
              <button className={`round ${listening ? "rec" : ""}`} onClick={mic} aria-label="Voice input">🎤</button>
              <button className="cta grow" disabled={busy} onClick={run}>
                {busy ? <span className="dots">Agent working</span> : "▶ Run agent"}
              </button>
            </div>
          </div>

          {busy && (
            <div className="card thinking">
              <div className="orb" />
              <p>Thinking, calling tools and talking to MCP servers…</p>
            </div>
          )}

          {last && !busy && (
            <div className="card answer">
              <div className="stats">
                <span>⏱ {(last.ms / 1000).toFixed(1)}s</span>
                <span>🔧 {toolCalls} tools</span>
                <span>🔌 {mcpCalls / 2} MCP</span>
                <button className="link" onClick={() => setTab("trace")}>View trace →</button>
              </div>
              {last.error ? <div className="error">⚠️ {last.error}</div> : <Markdown text={last.answer} />}
            </div>
          )}

          {runs.length > 1 && (
            <div className="card glass">
              <b>Run history</b>
              <ul className="history">
                {runs.slice(1).map((r, i) => (
                  <li key={i}>
                    <span className="chip">{PATTERNS.find((p) => p.id === r.pattern)?.emoji} {r.pattern}</span>
                    <span className="trunc">{r.task}</span>
                    <small className="muted">{(r.ms / 1000).toFixed(1)}s · {r.trace.filter((t) => t.type === "tool_call").length} tools</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === "trace" && (
        <div className="stack">
          {!last && <p className="muted center">Run the agent to see its trace.</p>}
          {last?.trace.map((e, i) => {
            const st = TYPE_STYLE[e.type];
            return (
              <div key={i} className={`trace ${st.cls}`}>
                <div className="trace-head">
                  <span>{st.icon} <b>{e.agent}</b> · {e.type.replace("_", " ")}</span>
                  <small>{(e.t / 1000).toFixed(2)}s</small>
                </div>
                <div className="trace-body">{e.content.length > 600 ? e.content.slice(0, 600) + "…" : e.content}</div>
                {e.data !== undefined && <pre className="trace-json">{JSON.stringify(e.data, null, 2).slice(0, 1500)}</pre>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
