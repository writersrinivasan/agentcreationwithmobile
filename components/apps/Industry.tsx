"use client";

import { useState } from "react";
import { AppHeader } from "../ui";
import { useStore } from "../store";
import { SCENARIOS } from "@/lib/data/scenarios";
import { TOOL_META } from "@/lib/agent/tools";

const PATTERN_LABEL = { react: "🔁 ReAct", plan_execute: "🗺️ Plan & Execute", supervisor: "👑 Supervisor", reflection: "🪞 Reflection" };

export function Industry() {
  const { tryScenario } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const s = SCENARIOS.find((x) => x.id === sel);

  if (s) {
    return (
      <div className="app">
        <button className="back-inline" onClick={() => setSel(null)}>‹ All scenarios</button>
        <div className="scenario-hero" style={{ background: s.gradient }}>
          <div className="sh-emoji">{s.emoji}</div>
          <small>{s.industry}</small>
          <h2>{s.title}</h2>
          <p>{s.problem}</p>
        </div>
        <div className="stack">
          <div className="card">
            <b>🤖 Agent: {s.agentName}</b>
            <p className="muted small">{s.instructions}</p>
            <div className="chips">
              <span className="chip">{PATTERN_LABEL[s.pattern]}</span>
              {s.tools.map((t) => {
                const m = TOOL_META.find((x) => x.name === t);
                return <span key={t} className="chip alt">{m?.emoji} {m?.label}</span>;
              })}
            </div>
          </div>
          <div className="card">
            <b>📱 Mobile flow</b>
            <div className="flow">
              {s.mobileFlow.map((f, i) => (
                <div key={f} className="flow-step">
                  <span className="flow-n" style={{ background: s.gradient }}>{i + 1}</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid2">
            <div className="card">
              <b>📈 KPIs</b>
              <ul className="ticks">{s.kpis.map((k) => <li key={k}>{k}</li>)}</ul>
            </div>
            <div className="card">
              <b>🛡️ Guardrails</b>
              <ul className="ticks">{s.guardrails.map((k) => <li key={k}>{k}</li>)}</ul>
            </div>
          </div>
          <div className="card">
            <b>🧱 Reference stack</b>
            <div className="chips">{s.stack.map((k) => <span key={k} className="chip ghost">{k}</span>)}</div>
          </div>
          <div className="card glass">
            <b>🎯 Sample task</b>
            <p>“{s.task}”</p>
          </div>
          <button className="cta" style={{ background: s.gradient }} onClick={() => tryScenario(s)}>
            🧪 Try it in Sandbox
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <AppHeader title="Industry" subtitle="Real-world agents built & run from a phone" color="#fda085" />
      <div className="scenario-grid">
        {SCENARIOS.map((x, i) => (
          <button key={x.id} className="scenario-tile" style={{ background: x.gradient, animationDelay: `${i * 35}ms` }} onClick={() => setSel(x.id)}>
            <span className="st-emoji">{x.emoji}</span>
            <small>{x.industry}</small>
            <b>{x.title}</b>
            <em>{PATTERN_LABEL[x.pattern]}</em>
          </button>
        ))}
      </div>
    </div>
  );
}
