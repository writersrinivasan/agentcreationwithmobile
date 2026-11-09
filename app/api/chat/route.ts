import { readKey, GROQ_BASE, DEFAULT_MODEL, GroqError } from "@/lib/groq";

export const runtime = "nodejs";

// Streams Groq chat completions straight back to the phone (SSE passthrough).
// BYOK: the key arrives per-request in a header and is never persisted.
export async function POST(req: Request) {
  try {
    const key = readKey(req);
    const { messages, model, temperature } = await req.json();
    const upstream = await fetch(`${GROQ_BASE}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        messages,
        temperature: temperature ?? 0.6,
        max_tokens: 1500,
        stream: true,
      }),
    });
    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      let msg = text;
      try { msg = JSON.parse(text)?.error?.message ?? text; } catch {}
      return Response.json({ error: `Groq ${upstream.status}: ${msg}` }, { status: upstream.status });
    }
    return new Response(upstream.body, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
    });
  } catch (e) {
    const status = e instanceof GroqError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}
