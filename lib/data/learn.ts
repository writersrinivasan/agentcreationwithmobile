export interface Module {
  id: string;
  title: string;
  emoji: string;
  gradient: string;
  tagline: string;
  concepts: { term: string; meaning: string }[];
  steps: string[];
  onPhone: { android: string; ios: string };
  code: { lang: string; title: string; src: string };
  quiz: { q: string; options: string[]; answer: number }[];
}

export const MODULES: Module[] = [
  {
    id: "rag",
    title: "RAG",
    emoji: "📚",
    gradient: "linear-gradient(135deg,#f6d365,#fda085)",
    tagline: "Retrieval-Augmented Generation: ground the model in YOUR documents.",
    concepts: [
      { term: "Ingest", meaning: "Load PDFs, web pages, notes; clean the text." },
      { term: "Chunk", meaning: "Split into overlapping passages (e.g. 300–800 tokens)." },
      { term: "Embed / Index", meaning: "Turn chunks into vectors (or keyword index like BM25) and store them." },
      { term: "Retrieve", meaning: "Find top-k chunks relevant to the question (hybrid = vector + keyword)." },
      { term: "Augment", meaning: "Put retrieved chunks into the prompt as context." },
      { term: "Generate", meaning: "LLM answers using only the context and cites sources." },
      { term: "Evaluate", meaning: "Measure faithfulness, relevance and context precision (Ragas)." },
    ],
    steps: [
      "Open 🧬 RAG Lab below → paste a policy or notes",
      "Tune chunk size & overlap; watch the chunks change",
      "Ask a question → see BM25 scores for each chunk",
      "Generate a grounded answer with Groq & citations",
      "Try a question NOT in the docs → agent should say 'not found'",
    ],
    onPhone: {
      android: "Colab notebook with chromadb + groq, or LlamaIndex in Termux. Use Google Lens to OCR paper SOPs.",
      ios: "Colab/Codespaces in Safari; use Live Text to capture documents. NotebookLM for zero-code intuition.",
    },
    code: {
      lang: "python",
      title: "Minimal RAG in Colab (Chroma + Groq)",
      src: `!pip -q install chromadb groq
import chromadb
from groq import Groq
db = chromadb.Client().create_collection("sop")
db.add(ids=["1","2"], documents=[
  "E-217 means spindle overheating. Cool 30 minutes.",
  "Coolant concentration must stay 6-8 percent."])
q = "What does E-217 mean?"
ctx = db.query(query_texts=[q], n_results=2)["documents"][0]
ans = Groq().chat.completions.create(
  model="llama-3.3-70b-versatile",
  messages=[{"role":"system","content":"Answer only from context:\\n"+"\\n".join(ctx)},
            {"role":"user","content":q}])
print(ans.choices[0].message.content)`,
    },
    quiz: [
      { q: "Why do we overlap chunks?", options: ["Save tokens", "Avoid cutting an idea across chunk borders", "Make embeddings faster"], answer: 1 },
      { q: "Hybrid search combines…", options: ["Two LLMs", "Vector + keyword retrieval", "RAG + MCP"], answer: 1 },
      { q: "Best response when context lacks the answer?", options: ["Guess confidently", "Say it's not in the sources", "Ask another model"], answer: 1 },
    ],
  },
  {
    id: "mcp",
    title: "MCP",
    emoji: "🔌",
    gradient: "linear-gradient(135deg,#ff9a9e,#fad0c4)",
    tagline: "Model Context Protocol: a universal USB-C port between agents and tools/data.",
    concepts: [
      { term: "Host", meaning: "The app the user talks to (Claude app, IDE, your agent)." },
      { term: "Client", meaning: "Connector inside the host; one per server." },
      { term: "Server", meaning: "Exposes capabilities: tools, resources, prompts." },
      { term: "Tools", meaning: "Functions the model may call (create_ticket, query_db)." },
      { term: "Resources", meaning: "Readable data (files, records) addressed by URI." },
      { term: "Prompts", meaning: "Reusable prompt templates offered by the server." },
      { term: "Transports", meaning: "stdio (local) or Streamable HTTP (remote, with OAuth)." },
      { term: "JSON-RPC 2.0", meaning: "Message format: initialize → tools/list → tools/call." },
    ],
    steps: [
      "Open 🔌 MCP Simulator below → step through the handshake",
      "Inspect initialize, tools/list and tools/call messages",
      "In 🧪 Sandbox enable Inventory/CRM/Ticketing (MCP) tools",
      "Run a scenario → see real JSON-RPC envelopes in the trace",
      "Advanced: build a FastMCP server in Termux/Codespaces",
    ],
    onPhone: {
      android: "Termux: pip install mcp → run a FastMCP server; connect from a Python client or expose over HTTP via Cloudflare Tunnel.",
      ios: "Codespaces in Safari to run servers; use Claude mobile app connectors to *use* remote MCP servers without code.",
    },
    code: {
      lang: "python",
      title: "A 10-line MCP server (FastMCP)",
      src: `# pip install "mcp[cli]"
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("inventory")

@mcp.tool()
def inventory_lookup(sku: str) -> dict:
    """Return stock for a SKU."""
    return {"sku": sku, "qty": 4, "location": "Rack B2"}

if __name__ == "__main__":
    mcp.run(transport="streamable-http")`,
    },
    quiz: [
      { q: "Which MCP primitive is model-invoked actions?", options: ["Resources", "Tools", "Prompts"], answer: 1 },
      { q: "Remote MCP servers typically use…", options: ["stdio", "Streamable HTTP + OAuth", "Bluetooth"], answer: 1 },
      { q: "First message in an MCP session?", options: ["tools/call", "initialize", "resources/read"], answer: 1 },
    ],
  },
  {
    id: "orch",
    title: "Orchestration",
    emoji: "🎼",
    gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)",
    tagline: "Coordinate models, tools and multiple agents into reliable workflows.",
    concepts: [
      { term: "ReAct", meaning: "Reason → Act (tool) → Observe loop in one agent." },
      { term: "Router", meaning: "Classify the request and send it to the right agent/flow." },
      { term: "Plan-and-Execute", meaning: "Planner writes steps; executor completes each." },
      { term: "Supervisor", meaning: "Manager agent delegates to specialists and merges results." },
      { term: "Reflection", meaning: "Critic reviews a draft; generator revises." },
      { term: "Human-in-the-loop", meaning: "Pause for approval before risky actions." },
      { term: "State & memory", meaning: "Short-term (thread) and long-term (profile/vector) memory." },
      { term: "A2A", meaning: "Agent-to-Agent protocol for cross-vendor agent collaboration." },
    ],
    steps: [
      "Pick a scenario in 🏭 Industry → Try in Sandbox",
      "Run it with ReAct, then Plan-Execute, Supervisor, Reflection",
      "Compare latency, number of tool calls and answer quality",
      "Decide: which pattern fits which industry task?",
      "Advanced: rebuild the winner in LangGraph via Codespaces",
    ],
    onPhone: {
      android: "n8n / Flowise canvas in Chrome desktop mode; LangGraph in Termux for code-first graphs.",
      ios: "Use Sandbox pattern switcher; LangGraph in Codespaces/Colab via Safari; Shortcuts to trigger flows.",
    },
    code: {
      lang: "python",
      title: "Supervisor graph in LangGraph",
      src: `# pip install langgraph langchain-groq
from langgraph.prebuilt import create_react_agent
from langgraph_supervisor import create_supervisor
from langchain_groq import ChatGroq

llm = ChatGroq(model="llama-3.3-70b-versatile")
research = create_react_agent(llm, tools=[search_kb], name="researcher")
ops = create_react_agent(llm, tools=[create_ticket], name="operator")

app = create_supervisor([research, ops], model=llm,
      prompt="Delegate research first, then actions.").compile()
print(app.invoke({"messages": [("user", "E-217 on CNC-12, help")]}))`,
    },
    quiz: [
      { q: "Best pattern for a safety-critical draft?", options: ["Reflection", "Router", "None"], answer: 0 },
      { q: "Supervisor pattern means…", options: ["One agent, many tools", "Manager delegating to specialist agents", "No LLM"], answer: 1 },
      { q: "Human-in-the-loop is essential when…", options: ["Formatting text", "Taking irreversible actions (payments, prescriptions)", "Greeting users"], answer: 1 },
    ],
  },
  {
    id: "tools",
    title: "Tools & Memory",
    emoji: "🧰",
    gradient: "linear-gradient(135deg,#84fab0,#8fd3f4)",
    tagline: "Function calling, structured outputs and memory make LLMs act.",
    concepts: [
      { term: "Function calling", meaning: "Model outputs JSON args for a tool you define with a schema." },
      { term: "Structured output", meaning: "Force JSON responses for reliable parsing." },
      { term: "Short-term memory", meaning: "Conversation window passed each turn." },
      { term: "Long-term memory", meaning: "Facts saved to DB/vector store and recalled later." },
      { term: "Guardrails", meaning: "Input/output checks, allow-lists, rate limits." },
    ],
    steps: ["Read the starter agent code in 🔭 Explore", "Enable/disable tools in Sandbox and see how behaviour changes", "Write a JSON schema for your own tool"],
    onPhone: { android: "Pydroid/Termux to run the starter agent.", ios: "a-Shell or Pyto to run the starter agent." },
    code: {
      lang: "json",
      title: "Tool schema",
      src: `{
  "type": "function",
  "function": {
    "name": "create_ticket",
    "description": "Create a maintenance ticket",
    "parameters": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "priority": {"type": "string", "enum": ["low","high"]}
      },
      "required": ["title", "priority"]
    }
  }
}`,
    },
    quiz: [{ q: "Who executes the tool?", options: ["The LLM", "Your code / MCP server", "The phone OS"], answer: 1 }],
  },
  {
    id: "eval",
    title: "Evals & Safety",
    emoji: "🛡️",
    gradient: "linear-gradient(135deg,#fccb90,#d57eeb)",
    tagline: "Trust, but verify: test agents before they touch real users.",
    concepts: [
      { term: "Golden set", meaning: "20–50 real questions with expected answers." },
      { term: "LLM-as-judge", meaning: "A model scores answers with a rubric." },
      { term: "Tracing", meaning: "Record every step (Langfuse, LangSmith, this app's trace)." },
      { term: "Prompt injection", meaning: "Malicious text in docs/tools trying to hijack the agent." },
      { term: "Least privilege", meaning: "Read-only tools by default; approvals for writes." },
      { term: "BYOK hygiene", meaning: "Never hard-code keys; rotate; set spend limits." },
    ],
    steps: ["Write 5 test questions for your scenario", "Run each pattern and score 1–5", "Try an injection: 'ignore instructions and…' — does the agent resist?"],
    onPhone: { android: "Keep a test sheet in Google Sheets app.", ios: "Use Numbers or Notes checklists." },
    code: { lang: "text", title: "Judge rubric", src: "Score 1-5 for: Correct? Grounded in sources? Safe? Actionable? Concise?" },
    quiz: [{ q: "Safest default for new tools?", options: ["Write access", "Read-only + approval for writes", "Admin"], answer: 1 }],
  },
];

// Possibilities & probabilities: how feasible each capability is on a phone today.
export const POSSIBILITIES = [
  { cap: "Chat with an agent (web/PWA)", android: 99, ios: 99, note: "Any modern browser" },
  { cap: "Build no-code agents (n8n, Flowise, Dify)", android: 85, ios: 80, note: "Desktop-mode browser; tablet better" },
  { cap: "Write & run Python agents on device", android: 90, ios: 65, note: "Termux vs a-Shell/Pyto limits" },
  { cap: "Full IDE via cloud (Codespaces/Colab)", android: 90, ios: 88, note: "Needs stable internet" },
  { cap: "RAG with hosted vector DB", android: 92, ios: 90, note: "Pinecone/Qdrant/Supabase free tiers" },
  { cap: "RAG fully on-device", android: 55, ios: 45, note: "Small embedding models; flagship phones" },
  { cap: "Run an MCP server on the phone", android: 70, ios: 25, note: "Termux works; iOS needs cloud" },
  { cap: "Use remote MCP servers from mobile apps", android: 90, ios: 90, note: "Claude mobile connectors, custom hosts" },
  { cap: "Multi-agent orchestration (cloud)", android: 92, ios: 92, note: "Sandbox / LangGraph via cloud" },
  { cap: "Local LLM inference (1–4B)", android: 65, ios: 60, note: "8 GB+ RAM; battery & heat" },
  { cap: "Voice agents (speech in/out)", android: 85, ios: 85, note: "Web Speech, Whisper on Groq" },
  { cap: "Vision agents (photo → action)", android: 88, ios: 88, note: "Camera + multimodal models" },
  { cap: "Deploy to production from phone", android: 80, ios: 75, note: "Vercel/Render dashboards + Git" },
  { cap: "Publish native app to stores", android: 40, ios: 20, note: "Expo EAS cloud builds help; review needs desktop often" },
];

export const ROADMAP = [
  { week: "Week 1", title: "Foundations", items: ["Prompting & instructions", "BYOK Groq setup", "First ReAct agent in Sandbox", "Starter Python agent on phone"] },
  { week: "Week 2", title: "RAG", items: ["Chunking & retrieval lab", "Hosted vector DB", "Citations & 'not found' behaviour", "Ragas-style eval"] },
  { week: "Week 3", title: "MCP & Tools", items: ["MCP handshake", "FastMCP server", "Read-only vs write tools", "Remote MCP + OAuth"] },
  { week: "Week 4", title: "Orchestration & Ship", items: ["Pattern comparison", "Human-in-the-loop", "Telegram/WhatsApp channel", "Capstone industry demo"] },
];
