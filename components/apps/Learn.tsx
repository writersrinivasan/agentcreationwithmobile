"use client";

import { useMemo, useState } from "react";
import { AppHeader, Code, KeyBanner, Markdown, Tabs } from "../ui";
import { useStore } from "../store";
import { MODULES, POSSIBILITIES, ROADMAP } from "@/lib/data/learn";
import { buildIndex, search, KNOWLEDGE_BASE } from "@/lib/rag";
import { TOOL_META } from "@/lib/agent/tools";
import { streamChat } from "@/lib/client";

type Tab = "modules" | "rag" | "mcp" | "orch" | "odds" | "roadmap";

export function Learn() {
  const [tab, setTab] = useState<Tab>("modules");
  return (
    <div className="app">
      <AppHeader title="Learn Lab" subtitle="RAG, MCP & orchestration — hands-on, thumb-first" color="#7c4dff" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "modules", label: "Modules" },
          { id: "rag", label: "🧬 RAG Lab" },
          { id: "mcp", label: "🔌 MCP Sim" },
          { id: "orch", label: "🎼 Patterns" },
          { id: "odds", label: "🎲 Possibilities" },
          { id: "roadmap", label: "🗓 Roadmap" },
        ]}
      />
      {tab === "modules" && <Modules />}
      {tab === "rag" && <RagLab />}
      {tab === "mcp" && <McpSim />}
      {tab === "orch" && <Patterns />}
      {tab === "odds" && <Possibilities />}
      {tab === "roadmap" && <Roadmap />}
    </div>
  );
}

function Modules() {
  const [sel, setSel] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const m = MODULES.find((x) => x.id === sel);
  if (!m) {
    return (
      <div className="stack">
        {MODULES.map((x) => (
          <button key={x.id} className="module-card" style={{ background: x.gradient }} onClick={() => setSel(x.id)}>
            <span className="mc-emoji">{x.emoji}</span>
            <span>
              <b>{x.title}</b>
              <small>{x.tagline}</small>
            </span>
            <span className="mc-go">›</span>
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="stack">
      <button className="back-inline" onClick={() => setSel(null)}>‹ Modules</button>
      <div className="scenario-hero" style={{ background: m.gradient }}>
        <div className="sh-emoji">{m.emoji}</div>
        <h2>{m.title}</h2>
        <p>{m.tagline}</p>
      </div>
      <div className="card">
        <b>Key concepts</b>
        <dl className="concepts">
          {m.concepts.map((c) => (
            <div key={c.term}>
              <dt>{c.term}</dt>
              <dd>{c.meaning}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="card">
        <b>Hands-on steps</b>
        <ol className="steps">{m.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      </div>
      <div className="grid2">
        <div className="card"><b>🤖 Android</b><p className="small">{m.onPhone.android}</p></div>
        <div className="card"><b>🍎 iOS</b><p className="small">{m.onPhone.ios}</p></div>
      </div>
      <Code src={m.code.src} title={m.code.title} />
      <div className="card">
        <b>Quick quiz</b>
        {m.quiz.map((q, qi) => {
          const k = `${m.id}-${qi}`;
          const a = answers[k];
          return (
            <div key={k} className="quiz">
              <p>{qi + 1}. {q.q}</p>
              {q.options.map((o, oi) => (
                <button
                  key={o}
                  className={`opt ${a === oi ? (oi === q.answer ? "right" : "wrong") : ""} ${a !== undefined && oi === q.answer ? "right" : ""}`}
                  onClick={() => setAnswers({ ...answers, [k]: oi })}
                >
                  {o}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SAMPLE = KNOWLEDGE_BASE.filter((d) => ["retail-returns", "agri-advisory", "factory-sop"].includes(d.id))
  .map((d) => `# ${d.title}\n${d.text}`)
  .join("\n\n");

function RagLab() {
  const { groqKey, model, notify } = useStore();
  const [text, setText] = useState(SAMPLE);
  const [size, setSize] = useState(40);
  const [overlap, setOverlap] = useState(10);
  const [q, setQ] = useState("Can I return earbuds without the box after 12 days?");
  const [k, setK] = useState(3);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  const index = useMemo(() => {
    const docs = text.split(/\n(?=# )/).map((block, i) => {
      const [first, ...rest] = block.split("\n");
      const isTitle = first.startsWith("# ");
      return { id: `doc${i}`, title: isTitle ? first.slice(2) : `Doc ${i + 1}`, text: isTitle ? rest.join(" ") : block };
    });
    return buildIndex(docs, size, Math.min(overlap, size - 1));
  }, [text, size, overlap]);
  const hits = useMemo(() => search(index, q, k), [index, q, k]);
  const max = hits[0]?.score || 1;

  async function generate() {
    if (!groqKey) return notify("Add your Groq key in Settings 🔑");
    setBusy(true);
    setAnswer("");
    const ctx = hits.map((h, i) => `[${i + 1}] (${h.chunk.title}) ${h.chunk.text}`).join("\n");
    try {
      await streamChat(
        groqKey,
        model,
        [
          {
            role: "system",
            content:
              "Answer ONLY from the numbered context. Cite like [1]. If the answer is not in the context, say 'I couldn't find that in the sources.' Keep it short.",
          },
          { role: "user", content: `Context:\n${ctx || "(no matching chunks)"}\n\nQuestion: ${q}` },
        ],
        (d) => setAnswer((a) => a + d)
      );
    } catch (e) {
      setAnswer(`⚠️ ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <KeyBanner />
      <div className="pipeline">
        {["📄 Ingest", "✂️ Chunk", "🗂 Index", "🔎 Retrieve", "🧩 Augment", "✨ Generate"].map((s, i) => (
          <span key={s} style={{ animationDelay: `${i * 120}ms` }}>{s}</span>
        ))}
      </div>
      <label className="field">
        <span>1 · Your documents <small className="muted">(start a doc with “# Title”)</small></span>
        <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <div className="grid2">
        <label className="field">
          <span>Chunk size: {size} words</span>
          <input type="range" min={15} max={120} value={size} onChange={(e) => setSize(+e.target.value)} />
        </label>
        <label className="field">
          <span>Overlap: {overlap}</span>
          <input type="range" min={0} max={40} value={overlap} onChange={(e) => setOverlap(+e.target.value)} />
        </label>
      </div>
      <p className="muted small">→ {index.N} chunks · {index.df.size} unique terms · BM25 keyword index (runs in your browser)</p>
      <label className="field">
        <span>2 · Ask a question</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <label className="field">
        <span>Top-k: {k}</span>
        <input type="range" min={1} max={6} value={k} onChange={(e) => setK(+e.target.value)} />
      </label>
      <div className="card">
        <b>3 · Retrieved chunks</b>
        {!hits.length && <p className="muted small">No matching chunks — the agent should refuse to guess.</p>}
        {hits.map((h, i) => (
          <div key={h.chunk.id} className="hit">
            <div className="hit-top">
              <span className="chip">[{i + 1}] {h.chunk.title}</span>
              <small>score {h.score.toFixed(2)}</small>
            </div>
            <div className="scorebar"><span style={{ width: `${(h.score / max) * 100}%` }} /></div>
            <p className="small">{h.chunk.text}</p>
          </div>
        ))}
      </div>
      <button className="cta" disabled={busy} onClick={generate}>{busy ? <span className="dots">Generating</span> : "4 · ✨ Generate grounded answer"}</button>
      {answer && <div className="card answer"><Markdown text={answer} /></div>}
    </div>
  );
}

function McpSim() {
  const mcpTools = TOOL_META.filter((t) => t.kind === "mcp");
  const [tool, setTool] = useState(mcpTools[0].name);
  const t = mcpTools.find((x) => x.name === tool)!;
  const sampleArgs: Record<string, unknown> =
    tool === "inventory_lookup" ? { sku: "SKU-1001" } : tool === "crm_lookup" ? { customer_id: "C-501" } : tool === "weather_forecast" ? { city: "Chennai" } : { title: "Spindle overheating CNC-12", priority: "high" };
  const msgs = [
    { dir: "→", who: "Client", label: "initialize", body: { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "pocket-agent", version: "1.0" } } } },
    { dir: "←", who: "Server", label: "capabilities", body: { jsonrpc: "2.0", id: 1, result: { protocolVersion: "2025-06-18", capabilities: { tools: {}, resources: {} }, serverInfo: { name: t.server } } } },
    { dir: "→", who: "Client", label: "notifications/initialized", body: { jsonrpc: "2.0", method: "notifications/initialized" } },
    { dir: "→", who: "Client", label: "tools/list", body: { jsonrpc: "2.0", id: 2, method: "tools/list" } },
    { dir: "←", who: "Server", label: "tool catalog", body: { jsonrpc: "2.0", id: 2, result: { tools: [{ name: t.name, description: t.description, inputSchema: t.parameters }] } } },
    { dir: "💭", who: "LLM", label: "decides to call tool", body: { tool_call: { name: t.name, arguments: sampleArgs } } },
    { dir: "→", who: "Client", label: "tools/call", body: { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: t.name, arguments: sampleArgs } } },
    { dir: "←", who: "Server", label: "result", body: { jsonrpc: "2.0", id: 3, result: { content: [{ type: "text", text: "{ …tool output… }" }], isError: false } } },
  ];
  const [step, setStep] = useState(0);

  return (
    <div className="stack">
      <div className="mcp-arch">
        <div className="node host">📱 Host<small>your agent app</small></div>
        <div className="wire" />
        <div className="node client">🔗 MCP Client</div>
        <div className="wire" />
        <div className="node server">🖥 {t.server}<small>tools · resources · prompts</small></div>
      </div>
      <label className="field">
        <span>Pick an MCP server/tool</span>
        <select value={tool} onChange={(e) => { setTool(e.target.value); setStep(0); }}>
          {mcpTools.map((x) => <option key={x.name} value={x.name}>{x.emoji} {x.server} → {x.name}</option>)}
        </select>
      </label>
      <div className="mcp-log">
        {msgs.slice(0, step + 1).map((m, i) => (
          <div key={i} className={`mcp-msg ${m.who.toLowerCase()}`}>
            <div className="mcp-h"><b>{m.dir} {m.who}</b> · {m.label}</div>
            <pre>{JSON.stringify(m.body, null, 2)}</pre>
          </div>
        ))}
      </div>
      <div className="row gap">
        <button className="pill" onClick={() => setStep(0)}>↺ Reset</button>
        <button className="cta grow" disabled={step >= msgs.length - 1} onClick={() => setStep(step + 1)}>
          {step >= msgs.length - 1 ? "✓ Handshake complete" : `Next message (${step + 1}/${msgs.length}) →`}
        </button>
      </div>
      <p className="muted small">Then open 🧪 Sandbox with MCP tools enabled to see live JSON-RPC envelopes in the trace.</p>
    </div>
  );
}

function Patterns() {
  const P = [
    { name: "ReAct", emoji: "🔁", nodes: ["User", "Agent ⇄ Tools", "Answer"], when: "Single focused task, few tools (FAQ + lookup).", cost: "Low" },
    { name: "Router", emoji: "🧭", nodes: ["User", "Router", "Agent A | B | C"], when: "Many intents: billing vs tech vs sales.", cost: "Low" },
    { name: "Plan & Execute", emoji: "🗺️", nodes: ["Planner", "Step 1 → 2 → 3", "Synthesizer"], when: "Multi-step calculations, reports.", cost: "Medium" },
    { name: "Supervisor", emoji: "👑", nodes: ["Supervisor", "Researcher · Analyst · Operator", "Merge"], when: "Cross-system work: CRM + ERP + ticketing.", cost: "Medium-High" },
    { name: "Reflection", emoji: "🪞", nodes: ["Generator", "Critic", "Revised answer"], when: "Safety-critical text (health, finance).", cost: "Medium" },
    { name: "Human-in-the-loop", emoji: "🙋", nodes: ["Agent proposes", "Human approves ✓", "Action executes"], when: "Payments, prescriptions, deletes.", cost: "Varies" },
  ];
  return (
    <div className="stack">
      {P.map((p) => (
        <div key={p.name} className="card pattern-card">
          <b>{p.emoji} {p.name}</b>
          <div className="pnodes">
            {p.nodes.map((n, i) => (
              <span key={n} className="pnode-wrap">
                <span className="pnode">{n}</span>
                {i < p.nodes.length - 1 && <span className="parrow">↓</span>}
              </span>
            ))}
          </div>
          <p className="small"><b>Use when:</b> {p.when}</p>
          <span className="chip ghost">Cost/latency: {p.cost}</span>
        </div>
      ))}
    </div>
  );
}

function Possibilities() {
  const avg = (k: "android" | "ios") => Math.round(POSSIBILITIES.reduce((s, p) => s + p[k], 0) / POSSIBILITIES.length);
  return (
    <div className="stack">
      <div className="grid2">
        <div className="card score-card android"><small>Android readiness</small><b>{avg("android")}%</b></div>
        <div className="card score-card ios"><small>iOS readiness</small><b>{avg("ios")}%</b></div>
      </div>
      <p className="muted small">Estimated probability that a typical training participant can do this from their phone today (trainer&apos;s estimates — adjust for your cohort).</p>
      {POSSIBILITIES.map((p) => (
        <div key={p.cap} className="card odds">
          <b>{p.cap}</b>
          <div className="odds-row"><span>🤖</span><div className="obar"><span className="a" style={{ width: `${p.android}%` }} /></div><small>{p.android}%</small></div>
          <div className="odds-row"><span>🍎</span><div className="obar"><span className="i" style={{ width: `${p.ios}%` }} /></div><small>{p.ios}%</small></div>
          <small className="muted">{p.note}</small>
        </div>
      ))}
    </div>
  );
}

function Roadmap() {
  return (
    <div className="timeline">
      {ROADMAP.map((r, i) => (
        <div key={r.week} className="tl-item" style={{ ["--c" as string]: ["#ff6b9d", "#ffb347", "#4fc3f7", "#7c4dff"][i] }}>
          <span className="tl-dot">{i + 1}</span>
          <div className="tl-card">
            <small className="muted">{r.week}</small>
            <div className="tl-title"><b>{r.title}</b></div>
            <ul className="ticks">{r.items.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      ))}
    </div>
  );
}
