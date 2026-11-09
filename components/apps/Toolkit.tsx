"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "../ui";
import { CATALOG, CATEGORIES, type Fit } from "@/lib/data/catalog";

export function Toolkit() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [fit, setFit] = useState<Fit | "all">("all");
  const [level, setLevel] = useState<string>("all");

  const items = useMemo(
    () =>
      CATALOG.filter(
        (i) =>
          (cat === "all" || i.cat === cat) &&
          (fit === "all" || i.fit.includes(fit)) &&
          (level === "all" || i.level === level) &&
          (!q || `${i.name} ${i.desc}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, cat, fit, level]
  );

  return (
    <div className="app">
      <AppHeader title="Toolkit" subtitle={`${CATALOG.length} tools, frameworks & platforms to learn`} color="#00b894" />
      <div className="search">
        <span>🔎</span>
        <input placeholder="Search LangGraph, MCP, Termux…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="scroll-x">
        <button className={`cat ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>✨ All</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`cat ${cat === c.id ? "on" : ""}`} style={{ ["--c" as string]: c.color }} onClick={() => setCat(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      <div className="filter-row">
        <select value={fit} onChange={(e) => setFit(e.target.value as Fit | "all")} aria-label="Platform">
          <option value="all">📱 Any platform</option>
          <option value="Android">🤖 Android</option>
          <option value="iOS">🍎 iOS</option>
          <option value="Browser">🌐 Browser</option>
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Level">
          <option value="all">🎯 Any level</option>
          <option>No-code</option>
          <option>Low-code</option>
          <option>Pro-code</option>
        </select>
      </div>
      <p className="muted small">{items.length} results</p>
      <div className="stack">
        {items.map((i) => {
          const c = CATEGORIES.find((x) => x.id === i.cat)!;
          return (
            <div key={i.name} className="tool-card" style={{ ["--c" as string]: c.color }}>
              <div className="tc-icon">{c.emoji}</div>
              <div className="tc-body">
                <div className="tc-top">
                  <b>{i.name}</b>
                  {i.url !== "#" && (
                    <a href={i.url} target="_blank" rel="noreferrer" aria-label={`Open ${i.name}`}>↗</a>
                  )}
                </div>
                <p>{i.desc}</p>
                <div className="chips">
                  <span className="chip" style={{ background: c.color }}>{c.label}</span>
                  <span className="chip alt">{i.level}</span>
                  {i.fit.map((f) => (
                    <span key={f} className="chip ghost">{f === "Android" ? "🤖" : f === "iOS" ? "🍎" : "🌐"} {f}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
