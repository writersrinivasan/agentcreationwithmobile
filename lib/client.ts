"use client";

import type { AgentConfig, TraceEvent } from "./agent/framework";

export interface Msg {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Stream a chat completion through our BYOK proxy. */
export async function streamChat(
  key: string,
  model: string,
  messages: Msg[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-groq-key": key },
    body: JSON.stringify({ model, messages }),
    signal,
  });
  if (!res.ok || !res.body) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || `Request failed (${res.status})`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const l = line.trim();
      if (!l.startsWith("data:")) continue;
      const data = l.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (delta) onDelta(delta);
      } catch {}
    }
  }
}

export async function runAgentApi(
  key: string,
  config: AgentConfig,
  task: string,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<{ answer: string; trace: TraceEvent[]; ms: number }> {
  const res = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-groq-key": key },
    body: JSON.stringify({ config, task, history }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error || `Agent failed (${res.status})`);
  return j;
}

export async function listModels(key: string): Promise<string[]> {
  const res = await fetch("/api/models", { headers: { "x-groq-key": key } });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error || "Key check failed");
  return j.models;
}
