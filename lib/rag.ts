// Tiny, dependency-free RAG toolkit that runs in the browser AND on the server.
// Chunking -> tokenising -> BM25 ranking. Perfect for learning on a phone:
// no vector DB needed, and every step is inspectable.

export interface Doc {
  id: string;
  title: string;
  text: string;
}

export interface Chunk {
  id: string;
  docId: string;
  title: string;
  text: string;
  tokens: string[];
}

export interface Hit {
  chunk: Chunk;
  score: number;
}

const STOP = new Set(
  "a an the and or but if of to in on for with by at from is are was were be been it its this that these those as into about over under than then so such can will would should could do does did not no yes you your we our they their i me my he she his her them us what which who whom how when where why".split(
    " "
  )
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => t.replace(/(ing|ed|es|s)$/, "") || t);
}

export function chunkText(doc: Doc, size = 60, overlap = 15): Chunk[] {
  const words = doc.text.split(/\s+/).filter(Boolean);
  const out: Chunk[] = [];
  const step = Math.max(1, size - overlap);
  for (let i = 0, n = 0; i < words.length; i += step, n++) {
    const text = words.slice(i, i + size).join(" ");
    out.push({ id: `${doc.id}#${n}`, docId: doc.id, title: doc.title, text, tokens: tokenize(text) });
    if (i + size >= words.length) break;
  }
  return out;
}

export function buildIndex(docs: Doc[], size?: number, overlap?: number) {
  const chunks = docs.flatMap((d) => chunkText(d, size, overlap));
  const df = new Map<string, number>();
  for (const c of chunks) for (const t of new Set(c.tokens)) df.set(t, (df.get(t) ?? 0) + 1);
  const avgLen = chunks.reduce((s, c) => s + c.tokens.length, 0) / Math.max(1, chunks.length);
  return { chunks, df, avgLen, N: chunks.length };
}

export type Index = ReturnType<typeof buildIndex>;

export function search(index: Index, query: string, k = 3): Hit[] {
  const q = tokenize(query);
  const k1 = 1.4;
  const b = 0.75;
  const hits: Hit[] = index.chunks.map((chunk) => {
    let score = 0;
    const len = chunk.tokens.length;
    for (const term of q) {
      const tf = chunk.tokens.filter((t) => t === term).length;
      if (!tf) continue;
      const n = index.df.get(term) ?? 0;
      const idf = Math.log(1 + (index.N - n + 0.5) / (n + 0.5));
      score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * len) / index.avgLen)));
    }
    return { chunk, score };
  });
  return hits
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

// ---------------------------------------------------------------------------
// Built-in knowledge base used by the sandbox agent's `knowledge_search` tool.
// ---------------------------------------------------------------------------
export const KNOWLEDGE_BASE: Doc[] = [
  {
    id: "factory-sop",
    title: "Plant 7 – CNC Machine Maintenance SOP",
    text: "CNC spindle vibration above 4.5 mm/s requires an immediate stop and inspection. Coolant concentration must stay between 6 and 8 percent; check with a refractometer every shift. Lubrication of guideways happens every 250 operating hours. If error code E-217 appears it indicates spindle overheating; allow 30 minutes cool down and verify coolant flow. Preventive maintenance windows are Sundays 06:00 to 10:00. Escalate unresolved faults to the maintenance supervisor on extension 4471 and log a ticket with machine id, error code and photos taken on the shop-floor phone.",
  },
  {
    id: "hospital-policy",
    title: "City Care Hospital – Discharge & Follow-up Policy",
    text: "Patients discharged after cardiac procedures need a follow-up call within 48 hours. Nurses use the mobile discharge checklist: medication reconciliation, wound care instructions, warning signs, and next appointment date. Any patient reporting chest pain, breathlessness or fever above 38.5 C must be advised to return to emergency immediately. AI assistants may summarise records but must never change prescriptions; a licensed clinician approves every medication change. Patient data must stay within the hospital's approved cloud region and be de-identified before analytics.",
  },
  {
    id: "retail-returns",
    title: "UrbanMart – Returns & Refund Policy",
    text: "Customers may return unused items within 30 days with a receipt. Electronics have a 15 day window and must include original packaging. Refunds go to the original payment method within 5 to 7 business days. Store credit is offered when no receipt is available, valued at the lowest selling price in the last 60 days. Damaged-on-arrival items are replaced free of charge after a photo is uploaded through the mobile app. Loyalty members in the Gold tier receive free return pickup.",
  },
  {
    id: "bank-kyc",
    title: "FinTrust Bank – Mobile KYC Guidelines",
    text: "Video KYC sessions must capture a live selfie, a government photo id and a geo-tagged location inside the country. Loan pre-approval agents may compute EMI and eligibility but final credit decisions require a human underwriter. Fraud signals include mismatched device fingerprint, more than three failed OTP attempts, and transfers above 2 lakh rupees to new beneficiaries within 24 hours. Suspicious activity must be flagged to the risk team within 15 minutes.",
  },
  {
    id: "agri-advisory",
    title: "Krishi Mitra – Paddy Crop Advisory",
    text: "For paddy, maintain 5 cm standing water during tillering. Brown spots with yellow halo on leaves usually indicate brown spot disease; recommend balanced potassium and a fungicide approved by the local agriculture office. Apply nitrogen in three splits: basal, tillering and panicle initiation. Farmers can send leaf photos via WhatsApp to the advisory agent, which replies in Tamil, Hindi or English. Weather alerts are sent 48 hours before heavy rainfall so spraying can be postponed.",
  },
  {
    id: "logistics-sla",
    title: "SwiftShip – Delivery SLA & Exception Handling",
    text: "Same-day deliveries must be dispatched before 14:00. Exceptions include address not found, customer unavailable and damaged parcel. Drivers update status from the driver app with a photo and GPS stamp. After two failed attempts the parcel returns to hub and the customer receives an automated reschedule link. Cold-chain shipments must stay between 2 and 8 C; temperature excursions over 20 minutes trigger an incident report.",
  },
  {
    id: "agent-basics",
    title: "Agent Fundamentals for Mobile Builders",
    text: "An AI agent combines a language model, instructions, tools and memory in a loop: observe, think, act, and reflect. On a phone you can build agents with no-code builders like n8n, Make, Zapier, Flowise or Botpress through the mobile browser, with Python in Termux on Android or a-Shell and Pyto on iOS, or in cloud IDEs such as GitHub Codespaces, Replit and Google Colab. Retrieval augmented generation (RAG) grounds answers in your documents. The Model Context Protocol (MCP) standardises how agents discover and call tools over JSON-RPC. Orchestration coordinates several agents with patterns like router, planner-executor, supervisor and human-in-the-loop.",
  },
];

let _index: Index | null = null;
export function kbIndex() {
  if (!_index) _index = buildIndex(KNOWLEDGE_BASE);
  return _index;
}
