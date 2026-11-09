// Tool registry for the PocketAgent framework.
// "native" tools run in-process; "mcp" tools simulate remote MCP servers so
// learners can see the exact JSON-RPC envelopes an MCP client would send.

import type { ToolSchema } from "../groq";
import { kbIndex, search } from "../rag";

export interface ToolDef {
  name: string;
  label: string;
  emoji: string;
  kind: "native" | "mcp";
  server?: string;
  description: string;
  parameters: Record<string, unknown>;
  run: (args: Record<string, any>) => Promise<unknown> | unknown;
}

// --- safe arithmetic parser (no eval) --------------------------------------
function calc(expr: string): number {
  const s = expr.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/");
  let i = 0;
  const peek = () => s[i];
  const num = (): number => {
    if (peek() === "(") {
      i++;
      const v = add();
      if (s[i++] !== ")") throw new Error("Missing )");
      return v;
    }
    if (peek() === "-") {
      i++;
      return -num();
    }
    const m = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (!m) throw new Error(`Unexpected token at ${i}`);
    i += m[0].length;
    return parseFloat(m[0]);
  };
  const pow = (): number => {
    let v = num();
    while (peek() === "^") {
      i++;
      v = Math.pow(v, num());
    }
    return v;
  };
  const mul = (): number => {
    let v = pow();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = s[i++];
      const r = pow();
      v = op === "*" ? v * r : op === "/" ? v / r : v % r;
    }
    return v;
  };
  const add = (): number => {
    let v = mul();
    while (peek() === "+" || peek() === "-") {
      const op = s[i++];
      const r = mul();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  };
  const v = add();
  if (i < s.length) throw new Error(`Unexpected '${s[i]}'`);
  return v;
}

const INVENTORY: Record<string, { name: string; qty: number; location: string; reorderAt: number }> = {
  "SKU-1001": { name: "Spindle bearing 7014", qty: 4, location: "Plant 7 / Rack B2", reorderAt: 6 },
  "SKU-2040": { name: "Coolant concentrate 20L", qty: 18, location: "Plant 7 / Store", reorderAt: 10 },
  "SKU-3300": { name: "Wireless earbuds X2", qty: 52, location: "UrbanMart Chennai", reorderAt: 20 },
  "SKU-4100": { name: "Insulin cold box", qty: 3, location: "SwiftShip Hub 2", reorderAt: 5 },
};

const CUSTOMERS: Record<string, { name: string; tier: string; city: string; openTickets: number; ltv: number }> = {
  "C-501": { name: "Priya Raman", tier: "Gold", city: "Chennai", openTickets: 1, ltv: 84000 },
  "C-502": { name: "Arjun Mehta", tier: "Silver", city: "Pune", openTickets: 0, ltv: 23000 },
  "C-503": { name: "Fatima Khan", tier: "Platinum", city: "Hyderabad", openTickets: 2, ltv: 210000 },
};

let ticketSeq = 9000;

export const TOOLS: ToolDef[] = [
  {
    name: "calculator",
    label: "Calculator",
    emoji: "🧮",
    kind: "native",
    description: "Evaluate an arithmetic expression. Supports + - * / % ^ and parentheses.",
    parameters: {
      type: "object",
      properties: { expression: { type: "string", description: "e.g. (1200*12)/0.85" } },
      required: ["expression"],
    },
    run: ({ expression }) => ({ expression, result: calc(String(expression)) }),
  },
  {
    name: "get_datetime",
    label: "Date & Time",
    emoji: "🕒",
    kind: "native",
    description: "Get the current date and time, optionally in an IANA timezone like Asia/Kolkata.",
    parameters: {
      type: "object",
      properties: { timezone: { type: "string" } },
    },
    run: ({ timezone }) => {
      const tz = timezone || "Asia/Kolkata";
      try {
        return { timezone: tz, now: new Date().toLocaleString("en-IN", { timeZone: tz }) };
      } catch {
        return { timezone: "UTC", now: new Date().toISOString() };
      }
    },
  },
  {
    name: "knowledge_search",
    label: "RAG Knowledge Search",
    emoji: "📚",
    kind: "native",
    description:
      "Search the company knowledge base (SOPs, policies, advisories for manufacturing, hospital, retail, bank, agriculture, logistics, agent basics). Use for any policy/procedure question.",
    parameters: {
      type: "object",
      properties: { query: { type: "string" }, top_k: { type: "number" } },
      required: ["query"],
    },
    run: ({ query, top_k }) =>
      search(kbIndex(), String(query), Math.min(5, Number(top_k) || 3)).map((h) => ({
        source: h.chunk.title,
        chunk: h.chunk.id,
        score: +h.score.toFixed(2),
        text: h.chunk.text,
      })),
  },
  {
    name: "inventory_lookup",
    label: "Inventory (MCP)",
    emoji: "📦",
    kind: "mcp",
    server: "mcp://erp-inventory",
    description: "Look up stock for a SKU (e.g. SKU-1001, SKU-2040, SKU-3300, SKU-4100) from the ERP MCP server.",
    parameters: {
      type: "object",
      properties: { sku: { type: "string" } },
      required: ["sku"],
    },
    run: ({ sku }) => {
      const item = INVENTORY[String(sku).toUpperCase()];
      if (!item) return { error: `Unknown SKU ${sku}`, known: Object.keys(INVENTORY) };
      return { sku, ...item, needsReorder: item.qty <= item.reorderAt };
    },
  },
  {
    name: "crm_lookup",
    label: "CRM (MCP)",
    emoji: "👤",
    kind: "mcp",
    server: "mcp://crm",
    description: "Fetch a customer profile by id (C-501, C-502, C-503) from the CRM MCP server.",
    parameters: {
      type: "object",
      properties: { customer_id: { type: "string" } },
      required: ["customer_id"],
    },
    run: ({ customer_id }) =>
      CUSTOMERS[String(customer_id).toUpperCase()] ?? { error: "Not found", known: Object.keys(CUSTOMERS) },
  },
  {
    name: "weather_forecast",
    label: "Weather (MCP)",
    emoji: "🌦️",
    kind: "mcp",
    server: "mcp://weather",
    description: "Get a 3-day simulated forecast for a city (demo data, deterministic).",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
    run: ({ city }) => {
      const seed = String(city)
        .split("")
        .reduce((s, c) => s + c.charCodeAt(0), 0);
      const kinds = ["Sunny", "Cloudy", "Heavy rain", "Thunderstorm", "Light rain"];
      return {
        city,
        note: "Simulated MCP data for training",
        days: [0, 1, 2].map((d) => ({
          day: `D+${d}`,
          sky: kinds[(seed + d * 3) % kinds.length],
          tempC: 24 + ((seed + d * 7) % 12),
          rainMm: ((seed * (d + 1)) % 40),
        })),
      };
    },
  },
  {
    name: "create_ticket",
    label: "Ticketing (MCP)",
    emoji: "🎫",
    kind: "mcp",
    server: "mcp://servicedesk",
    description: "Create a service/maintenance/support ticket. Returns the ticket id.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
        details: { type: "string" },
      },
      required: ["title", "priority"],
    },
    run: ({ title, priority, details }) => ({
      ticketId: `TKT-${++ticketSeq}`,
      title,
      priority,
      details: details ?? "",
      status: "OPEN",
      createdVia: "mobile-agent",
    }),
  },
  {
    name: "emi_calculator",
    label: "Loan EMI",
    emoji: "🏦",
    kind: "native",
    description: "Compute monthly EMI for a loan. principal in rupees, annual_rate in percent, months.",
    parameters: {
      type: "object",
      properties: {
        principal: { type: "number" },
        annual_rate: { type: "number" },
        months: { type: "number" },
      },
      required: ["principal", "annual_rate", "months"],
    },
    run: ({ principal, annual_rate, months }) => {
      const P = Number(principal);
      const r = Number(annual_rate) / 12 / 100;
      const n = Number(months);
      const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { emi: Math.round(emi), totalPayable: Math.round(emi * n), totalInterest: Math.round(emi * n - P) };
    },
  },
];

export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.name, t]));

export function toolSchemas(names: string[]): ToolSchema[] {
  return names
    .map((n) => TOOL_MAP[n])
    .filter(Boolean)
    .map((t) => ({
      type: "function" as const,
      function: { name: t.name, description: t.description, parameters: t.parameters },
    }));
}

// Public metadata (safe to send to the client)
export const TOOL_META = TOOLS.map(({ run: _run, ...meta }) => meta);
