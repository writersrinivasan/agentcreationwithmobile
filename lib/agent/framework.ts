// PocketAgent — a small, readable agentic AI framework built on Groq tool calling.
// Patterns: ReAct (single agent), Plan-and-Execute, Supervisor (multi-agent),
// and Reflection (generate -> critique -> revise). Every step is recorded in a
// trace so learners can watch the agent think on their phone.

import { groqChat, type ChatMessage, GroqError } from "../groq";
import { TOOL_MAP, toolSchemas } from "./tools";

export type Pattern = "react" | "plan_execute" | "supervisor" | "reflection";

export interface AgentConfig {
  name: string;
  instructions: string;
  tools: string[];
  pattern: Pattern;
  model?: string;
  maxSteps?: number;
}

export interface TraceEvent {
  type: "thought" | "tool_call" | "tool_result" | "mcp" | "plan" | "route" | "agent" | "critique" | "final" | "error";
  agent: string;
  content: string;
  data?: unknown;
  t: number;
}

class Tracer {
  events: TraceEvent[] = [];
  start = Date.now();
  rpc = 0;
  push(e: Omit<TraceEvent, "t">) {
    this.events.push({ ...e, t: Date.now() - this.start });
  }
}

async function callModel(key: string, model: string | undefined, messages: ChatMessage[], tools: string[]) {
  try {
    return await groqChat({ key, model, messages, tools: toolSchemas(tools) });
  } catch (e) {
    // Some models occasionally emit malformed tool calls; retry once with lower temperature.
    if (e instanceof GroqError && e.status === 400 && tools.length) {
      return await groqChat({ key, model, messages, tools: toolSchemas(tools), temperature: 0 });
    }
    throw e;
  }
}

async function execTool(tr: Tracer, agent: string, name: string, rawArgs: string) {
  const tool = TOOL_MAP[name];
  let args: Record<string, unknown> = {};
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    args = {};
  }
  tr.push({ type: "tool_call", agent, content: `${tool?.emoji ?? "🔧"} ${name}`, data: args });
  if (!tool) {
    const err = { error: `Unknown tool ${name}` };
    tr.push({ type: "tool_result", agent, content: "unknown tool", data: err });
    return err;
  }
  const id = ++tr.rpc;
  if (tool.kind === "mcp") {
    tr.push({
      type: "mcp",
      agent,
      content: `→ ${tool.server} tools/call`,
      data: { jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } },
    });
  }
  let result: unknown;
  try {
    result = await tool.run(args as Record<string, any>);
  } catch (e) {
    result = { error: (e as Error).message };
  }
  if (tool.kind === "mcp") {
    tr.push({
      type: "mcp",
      agent,
      content: `← ${tool.server} result`,
      data: { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(result) }] } },
    });
  }
  tr.push({ type: "tool_result", agent, content: name, data: result });
  return result;
}

/** Core ReAct loop: think -> call tools -> observe -> repeat -> answer. */
async function reactLoop(
  tr: Tracer,
  key: string,
  model: string | undefined,
  agent: string,
  system: string,
  task: string,
  tools: string[],
  maxSteps: number,
  history: ChatMessage[] = []
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `${system}\n\nYou are "${agent}". Use tools when they help. Think step by step, be concise, and cite knowledge sources by title when you use them.`,
    },
    ...history,
    { role: "user", content: task },
  ];
  for (let step = 0; step < maxSteps; step++) {
    const msg = await callModel(key, model, messages, tools);
    messages.push(msg);
    if (msg.tool_calls?.length) {
      if (msg.content) tr.push({ type: "thought", agent, content: msg.content });
      for (const tc of msg.tool_calls) {
        const result = await execTool(tr, agent, tc.function.name, tc.function.arguments);
        messages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result).slice(0, 4000) });
      }
      continue;
    }
    return msg.content ?? "";
  }
  const final = await groqChat({
    key,
    model,
    messages: [...messages, { role: "user", content: "Step limit reached. Give your best final answer now." }],
  });
  return final.content ?? "";
}

async function planExecute(tr: Tracer, key: string, cfg: AgentConfig, task: string, history: ChatMessage[]) {
  const planMsg = await groqChat({
    key,
    model: cfg.model,
    json: true,
    messages: [
      {
        role: "system",
        content: `You are a planner. Break the user's task into 2-5 concrete steps. Available tools: ${
          cfg.tools.join(", ") || "none"
        }. Respond as JSON: {"steps":["..."]}`,
      },
      { role: "user", content: task },
    ],
  });
  let steps: string[] = [];
  try {
    steps = JSON.parse(planMsg.content ?? "{}").steps ?? [];
  } catch {}
  if (!steps.length) steps = [task];
  tr.push({ type: "plan", agent: "Planner", content: `${steps.length}-step plan`, data: steps });

  const results: string[] = [];
  for (const [i, s] of steps.entries()) {
    tr.push({ type: "agent", agent: "Executor", content: `Step ${i + 1}: ${s}` });
    const out = await reactLoop(
      tr,
      key,
      cfg.model,
      "Executor",
      cfg.instructions,
      `Overall task: ${task}\nPrevious results:\n${results.join("\n") || "(none)"}\n\nDo only this step: ${s}`,
      cfg.tools,
      4
    );
    results.push(`Step ${i + 1} result: ${out}`);
    tr.push({ type: "thought", agent: "Executor", content: out });
  }
  const synth = await groqChat({
    key,
    model: cfg.model,
    messages: [
      { role: "system", content: `${cfg.instructions}\nYou are the synthesizer. Write the final answer for the user.` },
      ...history,
      { role: "user", content: `Task: ${task}\n\n${results.join("\n\n")}` },
    ],
  });
  return synth.content ?? "";
}

const SPECIALISTS: Record<string, { brief: string; tools: (all: string[]) => string[] }> = {
  Researcher: {
    brief: "Finds facts from the knowledge base, CRM, inventory and weather.",
    tools: (all) => all.filter((t) => ["knowledge_search", "crm_lookup", "inventory_lookup", "weather_forecast", "get_datetime"].includes(t)),
  },
  Analyst: {
    brief: "Does numbers: calculations, EMI, thresholds, comparisons.",
    tools: (all) => all.filter((t) => ["calculator", "emi_calculator", "inventory_lookup"].includes(t)),
  },
  Operator: {
    brief: "Takes actions such as creating tickets.",
    tools: (all) => all.filter((t) => ["create_ticket", "get_datetime"].includes(t)),
  },
};

async function supervisor(tr: Tracer, key: string, cfg: AgentConfig, task: string, history: ChatMessage[]) {
  const roster = Object.entries(SPECIALISTS)
    .map(([n, s]) => `- ${n}: ${s.brief} (tools: ${s.tools(cfg.tools).join(", ") || "none"})`)
    .join("\n");
  const route = await groqChat({
    key,
    model: cfg.model,
    json: true,
    messages: [
      {
        role: "system",
        content: `You are a supervisor agent. Specialists:\n${roster}\nChoose an ordered list of specialists (1-3) and give each a subtask. JSON: {"assignments":[{"agent":"Researcher","subtask":"..."}]}`,
      },
      { role: "user", content: task },
    ],
  });
  let assignments: { agent: string; subtask: string }[] = [];
  try {
    assignments = JSON.parse(route.content ?? "{}").assignments ?? [];
  } catch {}
  assignments = assignments.filter((a) => SPECIALISTS[a.agent]);
  if (!assignments.length) assignments = [{ agent: "Researcher", subtask: task }];
  tr.push({ type: "route", agent: "Supervisor", content: assignments.map((a) => a.agent).join(" → "), data: assignments });

  const notes: string[] = [];
  for (const a of assignments) {
    tr.push({ type: "agent", agent: a.agent, content: a.subtask });
    const out = await reactLoop(
      tr,
      key,
      cfg.model,
      a.agent,
      `${cfg.instructions}\nYour specialty: ${SPECIALISTS[a.agent].brief}`,
      `${a.subtask}\n\nContext from teammates:\n${notes.join("\n") || "(none)"}`,
      SPECIALISTS[a.agent].tools(cfg.tools),
      4
    );
    notes.push(`${a.agent}: ${out}`);
    tr.push({ type: "thought", agent: a.agent, content: out });
  }
  const final = await groqChat({
    key,
    model: cfg.model,
    messages: [
      { role: "system", content: `${cfg.instructions}\nYou are the supervisor. Merge the team's work into one clear answer.` },
      ...history,
      { role: "user", content: `Task: ${task}\n\nTeam notes:\n${notes.join("\n\n")}` },
    ],
  });
  return final.content ?? "";
}

async function reflection(tr: Tracer, key: string, cfg: AgentConfig, task: string, history: ChatMessage[]) {
  const draft = await reactLoop(tr, key, cfg.model, cfg.name, cfg.instructions, task, cfg.tools, cfg.maxSteps ?? 5, history);
  tr.push({ type: "thought", agent: cfg.name, content: `Draft: ${draft}` });
  const critique = await groqChat({
    key,
    model: cfg.model,
    messages: [
      {
        role: "system",
        content: "You are a strict reviewer. List up to 3 concrete issues (accuracy, safety, missing steps, clarity) with the draft. If it is good, say 'LGTM'.",
      },
      { role: "user", content: `Task: ${task}\n\nDraft:\n${draft}` },
    ],
  });
  tr.push({ type: "critique", agent: "Critic", content: critique.content ?? "" });
  if (/^\s*LGTM/i.test(critique.content ?? "")) return draft;
  const revised = await groqChat({
    key,
    model: cfg.model,
    messages: [
      { role: "system", content: cfg.instructions },
      { role: "user", content: `Task: ${task}\n\nDraft:\n${draft}\n\nReviewer feedback:\n${critique.content}\n\nWrite the improved final answer.` },
    ],
  });
  return revised.content ?? draft;
}

export async function runAgent(key: string, cfg: AgentConfig, task: string, history: ChatMessage[] = []) {
  const tr = new Tracer();
  const maxSteps = Math.min(8, cfg.maxSteps ?? 5);
  tr.push({ type: "agent", agent: cfg.name, content: `Pattern: ${cfg.pattern} · Tools: ${cfg.tools.join(", ") || "none"}` });
  let answer = "";
  try {
    switch (cfg.pattern) {
      case "plan_execute":
        answer = await planExecute(tr, key, cfg, task, history);
        break;
      case "supervisor":
        answer = await supervisor(tr, key, cfg, task, history);
        break;
      case "reflection":
        answer = await reflection(tr, key, cfg, task, history);
        break;
      default:
        answer = await reactLoop(tr, key, cfg.model, cfg.name, cfg.instructions, task, cfg.tools, maxSteps, history);
    }
    tr.push({ type: "final", agent: cfg.name, content: answer });
  } catch (e) {
    tr.push({ type: "error", agent: cfg.name, content: (e as Error).message });
  }
  return { answer, trace: tr.events, ms: Date.now() - tr.start };
}
