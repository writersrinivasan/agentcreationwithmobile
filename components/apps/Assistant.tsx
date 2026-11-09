"use client";

import { useEffect, useRef, useState } from "react";
import { AppHeader, KeyBanner, Markdown } from "../ui";
import { useStore } from "../store";
import { streamChat, type Msg } from "@/lib/client";

const SYSTEM = `You are "AI Buddy", a friendly, expert coach inside the PocketAgent Lab — a training app that teaches participants to create AI agents using only their mobile phones (Android and iOS).
Expertise: agent design, prompt/instruction writing, tool calling, RAG, MCP (Model Context Protocol), multi-agent orchestration (ReAct, plan-and-execute, supervisor, reflection, human-in-the-loop), LangGraph, CrewAI, n8n, Flowise, Termux, a-Shell, Pyto, Codespaces, Colab, Groq, deployment, evals and safety.
Style: concise, mobile-friendly (short paragraphs, bullets), practical steps that work on a phone, mention Android vs iOS differences when relevant, include small code snippets when useful. Encourage hands-on practice in the app's Sandbox and Learn Lab.`;

const SUGGESTIONS = [
  "How do I build my first agent on an iPhone?",
  "Explain MCP like I'm 12 🔌",
  "Set up Termux for a Python RAG agent",
  "Which orchestration pattern for a hospital agent?",
  "Give me a 7-day mobile learning plan",
  "Design a WhatsApp agent for farmers 🌾",
];

export function Assistant() {
  const { groqKey, model, notify } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    if (!groqKey) return notify("Add your Groq key in Settings 🔑");
    const next: Msg[] = [...msgs, { role: "user", content: text }, { role: "assistant", content: "" }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      await streamChat(
        groqKey,
        model,
        [{ role: "system", content: SYSTEM }, ...next.slice(-13, -1)],
        (d) =>
          setMsgs((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + d };
            return copy;
          }),
        ctrl.signal
      );
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${(e as Error).message}` };
          return copy;
        });
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="app chat-app">
      <AppHeader
        title="AI Buddy"
        subtitle={`Groq · ${model}`}
        color="#f5576c"
        right={msgs.length ? <button className="pill" onClick={() => setMsgs([])}>New chat</button> : null}
      />
      <KeyBanner />
      <div className="chat">
        {!msgs.length && (
          <div className="chat-empty">
            <div className="buddy">🤖</div>
            <p>Ask me anything about building agents from your phone.</p>
            <div className="suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.role === "assistant" ? (m.content ? <Markdown text={m.content} /> : <span className="typing"><i /><i /><i /></span>) : m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message AI Buddy…" aria-label="Message" />
        {busy ? (
          <button type="button" className="send stop" onClick={() => abortRef.current?.abort()} aria-label="Stop">■</button>
        ) : (
          <button type="submit" className="send" aria-label="Send" disabled={!input.trim()}>↑</button>
        )}
      </form>
    </div>
  );
}
