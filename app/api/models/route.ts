import { readKey, GROQ_BASE, GroqError } from "@/lib/groq";

export const runtime = "nodejs";

// Validates the user's key and lists the chat models it can use.
export async function GET(req: Request) {
  try {
    const key = readKey(req);
    const res = await fetch(`${GROQ_BASE}/models`, { headers: { Authorization: `Bearer ${key}` } });
    if (!res.ok) {
      return Response.json({ error: res.status === 401 ? "Invalid API key" : `Groq ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    const models: string[] = (data.data ?? [])
      .filter((m: { id: string; active?: boolean }) => m.active !== false && !/whisper|tts|guard|playai|orpheus|prompt-guard/i.test(m.id))
      .map((m: { id: string }) => m.id)
      .sort();
    return Response.json({ models });
  } catch (e) {
    const status = e instanceof GroqError ? e.status : 500;
    return Response.json({ error: (e as Error).message }, { status });
  }
}
