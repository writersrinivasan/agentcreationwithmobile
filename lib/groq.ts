// Minimal Groq (OpenAI-compatible) client. The key is always supplied by the
// caller (BYOK) and is never stored or logged on the server.

export const GROQ_BASE = "https://api.groq.com/openai/v1";
export const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export type Role = "system" | "user" | "assistant" | "tool";

export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface ChatMessage {
  role: Role;
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolSchema {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export class GroqError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function readKey(req: Request): string {
  const key = req.headers.get("x-groq-key")?.trim() ?? "";
  if (!key) throw new GroqError("Missing Groq API key. Add yours in Settings (BYOK).", 401);
  return key;
}

export async function groqChat(opts: {
  key: string;
  model?: string;
  messages: ChatMessage[];
  tools?: ToolSchema[];
  temperature?: number;
  json?: boolean;
  maxTokens?: number;
}): Promise<ChatMessage> {
  const body: Record<string, unknown> = {
    model: opts.model || DEFAULT_MODEL,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens ?? 1024,
  };
  if (opts.tools?.length) {
    body.tools = opts.tools;
    body.tool_choice = "auto";
  }
  if (opts.json) body.response_format = { type: "json_object" };

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${opts.key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      msg = JSON.parse(text)?.error?.message ?? text;
    } catch {}
    throw new GroqError(`Groq ${res.status}: ${msg}`, res.status);
  }
  const data = await res.json();
  const m = data.choices?.[0]?.message ?? {};
  return { role: "assistant", content: m.content ?? null, tool_calls: m.tool_calls };
}
