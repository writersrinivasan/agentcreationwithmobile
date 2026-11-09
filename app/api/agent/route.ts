import { NextResponse } from "next/server";
import { readKey, GroqError } from "@/lib/groq";
import { runAgent, type AgentConfig } from "@/lib/agent/framework";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const key = readKey(req);
    const { config, task, history } = (await req.json()) as {
      config: AgentConfig;
      task: string;
      history?: { role: "user" | "assistant"; content: string }[];
    };
    if (!task?.trim()) return NextResponse.json({ error: "Task is empty" }, { status: 400 });
    const result = await runAgent(key, config, task, (history ?? []).slice(-6));
    return NextResponse.json(result);
  } catch (e) {
    const status = e instanceof GroqError ? e.status : 500;
    return NextResponse.json({ error: (e as Error).message }, { status });
  }
}
