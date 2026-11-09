"use client";

import { useState } from "react";
import { AppHeader, Code, Collapse, Tabs } from "../ui";
import { useStore } from "../store";
import { DEVICE_TIPS, PERSONAS, SANDBOXES, STAGES, STARTER_AGENT_PY, type OS } from "@/lib/data/journey";

type Tab = "journey" | "personas" | "sandbox" | "starter";

export function Explore() {
  const { device } = useStore();
  const [os, setOs] = useState<OS>(device);
  const [tab, setTab] = useState<Tab>("journey");
  const [done, setDone] = useState<number[]>([]);

  return (
    <div className="app">
      <AppHeader title="Explore" subtitle="How participants create agents from their phones" color="#ff6b9d" />
      <div className="seg">
        <button className={os === "android" ? "on android" : ""} onClick={() => setOs("android")}>🤖 Android</button>
        <button className={os === "ios" ? "on ios" : ""} onClick={() => setOs("ios")}>🍎 iOS</button>
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "journey", label: "Journey" },
          { id: "personas", label: "Personas" },
          { id: "sandbox", label: "Sandboxes" },
          { id: "starter", label: "Starter code" },
        ]}
      />

      {tab === "journey" && (
        <div className="stack">
          <div className="progress">
            <div className="bar" style={{ width: `${(done.length / STAGES.length) * 100}%` }} />
            <span>{done.length}/{STAGES.length} stages done</span>
          </div>
          <div className="timeline">
            {STAGES.map((s) => {
              const isDone = done.includes(s.n);
              return (
                <div key={s.n} className={`tl-item ${isDone ? "done" : ""}`} style={{ ["--c" as string]: s.color }}>
                  <button
                    className="tl-dot"
                    aria-label={`Mark ${s.title} ${isDone ? "not done" : "done"}`}
                    onClick={() => setDone(isDone ? done.filter((d) => d !== s.n) : [...done, s.n])}
                  >
                    {isDone ? "✓" : s.emoji}
                  </button>
                  <div className="tl-card">
                    <div className="tl-title">
                      <b>{s.n}. {s.title}</b>
                    </div>
                    <p>{s.what}</p>
                    <ul className="ticks">
                      {(os === "android" ? s.android : s.ios).map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card glass">
            <b>{os === "android" ? "🤖 Android tips" : "🍎 iOS tips"}</b>
            <ul className="ticks">
              {DEVICE_TIPS[os].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "personas" && (
        <div className="grid2">
          {PERSONAS.map((p) => (
            <div key={p.name} className="card persona">
              <div className="persona-emoji">{p.emoji}</div>
              <b>{p.name}</b>
              <p>{p.goal}</p>
              <div className="chips">
                <span className="chip">{p.skill}</span>
                <span className="chip alt">{p.device}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "sandbox" && (
        <div className="stack">
          <p className="muted">Sandbox environments that work from {os === "android" ? "an Android phone" : "an iPhone/iPad"}:</p>
          {SANDBOXES.filter((s) => s.os.includes(os)).map((s, i) => (
            <Collapse
              key={s.name}
              defaultOpen={i === 0}
              title={
                <span className="row gap">
                  <span className="mini-icon">{s.emoji}</span>
                  <span>
                    <b>{s.name}</b>
                    <small className="muted block">{s.level} · {s.cost}</small>
                  </span>
                </span>
              }
            >
              <ol className="steps">
                {s.setup.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
              {s.code && <Code src={s.code} title="terminal" />}
            </Collapse>
          ))}
        </div>
      )}

      {tab === "starter" && (
        <div className="stack">
          <p className="muted">
            A complete tool-calling agent in ~30 lines. Runs in Termux, Pydroid, a-Shell, Pyto, Colab or Codespaces.
          </p>
          <Code src={STARTER_AGENT_PY} title="agent.py" />
          <div className="card glass">
            <b>What&apos;s happening?</b>
            <ol className="steps">
              <li><b>Observe</b> – the user question enters <code>msgs</code></li>
              <li><b>Think</b> – Groq decides whether a tool is needed</li>
              <li><b>Act</b> – your code runs the tool</li>
              <li><b>Reflect</b> – the result goes back; loop until an answer</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
