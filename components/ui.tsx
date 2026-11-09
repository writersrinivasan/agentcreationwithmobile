"use client";

import { useState, type ReactNode } from "react";
import { useStore } from "./store";

export function AppHeader({ title, subtitle, color, right }: { title: string; subtitle?: string; color?: string; right?: ReactNode }) {
  const { open, device } = useStore();
  return (
    <header className={`app-header ${device}`} style={{ ["--accent" as string]: color ?? "#7c4dff" }}>
      <div className="app-header-row">
        <button className="back-btn" onClick={() => open("home")} aria-label="Back to home">
          {device === "ios" ? "‹ Home" : "←"}
        </button>
        <div className="app-header-right">{right}</div>
      </div>
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </header>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className={value === t.id ? "on" : ""} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Code({ src, title }: { src: string; title?: string }) {
  const { notify } = useStore();
  return (
    <div className="code">
      <div className="code-bar">
        <span>{title ?? "code"}</span>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(src).then(() => notify("Copied 📋"), () => notify("Copy failed"));
          }}
        >
          Copy
        </button>
      </div>
      <pre>{src}</pre>
    </div>
  );
}

export function Collapse({ title, children, defaultOpen = false }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [o, setO] = useState(defaultOpen);
  return (
    <div className={`collapse ${o ? "open" : ""}`}>
      <button className="collapse-head" onClick={() => setO(!o)} aria-expanded={o}>
        <span>{title}</span>
        <span className="chev">{o ? "−" : "+"}</span>
      </button>
      {o && <div className="collapse-body">{children}</div>}
    </div>
  );
}

export function KeyBanner() {
  const { groqKey, open } = useStore();
  if (groqKey) return null;
  return (
    <button className="key-banner" onClick={() => open("settings")}>
      🔑 Add your Groq API key (BYOK) in Settings to run live AI →
    </button>
  );
}

// Tiny, safe markdown renderer (escapes HTML first).
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inline(s: string) {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
export function md(text: string): string {
  const parts = esc(text).split(/```[a-z]*\n?/);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return `<pre class="md-pre">${part}</pre>`;
      const lines = part.split("\n");
      let html = "";
      let list: "ul" | "ol" | null = null;
      const close = () => {
        if (list) html += `</${list}>`;
        list = null;
      };
      for (const raw of lines) {
        const l = raw.trimEnd();
        let m;
        if ((m = /^#{1,4}\s+(.*)/.exec(l))) {
          close();
          html += `<h4>${inline(m[1])}</h4>`;
        } else if ((m = /^\s*[-*•]\s+(.*)/.exec(l))) {
          if (list !== "ul") {
            close();
            html += "<ul>";
            list = "ul";
          }
          html += `<li>${inline(m[1])}</li>`;
        } else if ((m = /^\s*\d+[.)]\s+(.*)/.exec(l))) {
          if (list !== "ol") {
            close();
            html += "<ol>";
            list = "ol";
          }
          html += `<li>${inline(m[1])}</li>`;
        } else if (!l.trim()) {
          close();
        } else {
          close();
          html += `<p>${inline(l)}</p>`;
        }
      }
      close();
      return html;
    })
    .join("");
}

export function Markdown({ text }: { text: string }) {
  return <div className="md" dangerouslySetInnerHTML={{ __html: md(text) }} />;
}
