export type OS = "android" | "ios";

export const PERSONAS = [
  { emoji: "🧑‍🏭", name: "Shop-floor Supervisor", goal: "Maintenance agent that reads SOPs and raises tickets", skill: "No-code", device: "Android mid-range" },
  { emoji: "👩‍⚕️", name: "Nurse Educator", goal: "Discharge follow-up agent with safe escalation", skill: "No-code → Low-code", device: "iPhone" },
  { emoji: "👨‍💻", name: "Junior Developer", goal: "Python RAG + MCP agent deployed to the cloud", skill: "Pro-code", device: "Android + Termux" },
  { emoji: "👩‍🏫", name: "College Student", goal: "Study-buddy agent over lecture notes", skill: "Beginner", device: "iPhone / iPad" },
  { emoji: "🧑‍🌾", name: "Agri Field Officer", goal: "WhatsApp crop advisory agent in Tamil/Hindi", skill: "No-code", device: "Budget Android" },
  { emoji: "🧑‍💼", name: "Sales Manager", goal: "CRM lookup + follow-up email drafting agent", skill: "Low-code", device: "iPhone" },
];

export const STAGES = [
  {
    n: 1,
    title: "Discover",
    emoji: "🔭",
    color: "#ff6b9d",
    what: "Participants open this web app in their phone browser and pick a persona & industry scenario.",
    android: ["Open Chrome → visit the lab URL", "Menu ⋮ → Add to Home screen (installs as app)", "Allow notifications for daily challenges"],
    ios: ["Open Safari → visit the lab URL", "Share ⬆️ → Add to Home Screen", "Use Focus mode to avoid distractions during labs"],
  },
  {
    n: 2,
    title: "Get a key (BYOK)",
    emoji: "🔑",
    color: "#ffb347",
    what: "Each participant creates a free Groq API key and pastes it into Settings. It is stored only on their phone.",
    android: ["console.groq.com → Sign in with Google", "API Keys → Create → long-press to copy", "Paste into ⚙️ Settings → Test key"],
    ios: ["console.groq.com → Sign in with Apple/Google", "Create key → tap Copy", "Paste into ⚙️ Settings; iCloud Keychain can save it"],
  },
  {
    n: 3,
    title: "Design the agent",
    emoji: "🧠",
    color: "#7ee081",
    what: "Write the instructions (role, goal, guardrails), choose tools, choose an orchestration pattern.",
    android: ["Use voice typing (Gboard 🎤) to dictate instructions", "Split-screen: scenario card + Sandbox"],
    ios: ["Use dictation 🎤 on the keyboard", "Stage Manager / Split View on iPad for side-by-side"],
  },
  {
    n: 4,
    title: "Build in Sandbox",
    emoji: "🧪",
    color: "#4fc3f7",
    what: "Run the agent in the built-in sandbox: watch thoughts, tool calls, MCP JSON-RPC and final answers.",
    android: ["Sandbox app in this lab (zero install)", "Optional: Termux + Python for code-first agents"],
    ios: ["Sandbox app in this lab (zero install)", "Optional: a-Shell / Pyto for Python on device"],
  },
  {
    n: 5,
    title: "Ground with RAG",
    emoji: "📚",
    color: "#b388ff",
    what: "Paste or upload policy text, chunk it, retrieve and generate grounded answers with citations.",
    android: ["Copy text from PDFs via Google Drive → paste into RAG Lab", "Use Google Lens to OCR paper SOPs"],
    ios: ["Live Text: long-press text in a photo → copy", "Files app → share PDF text into RAG Lab"],
  },
  {
    n: 6,
    title: "Connect tools (MCP)",
    emoji: "🔌",
    color: "#ff8a65",
    what: "Understand MCP: servers expose tools/resources/prompts; agents discover and call them via JSON-RPC.",
    android: ["Run a small MCP server in Termux (Python/Node)", "Or use hosted MCP servers via a cloud IDE"],
    ios: ["Use Codespaces in Safari for MCP servers", "Shortcuts app can call webhooks your agent exposes"],
  },
  {
    n: 7,
    title: "Orchestrate",
    emoji: "🎼",
    color: "#f06292",
    what: "Compare ReAct, Plan-and-Execute, Supervisor multi-agent and Reflection on the same task.",
    android: ["Switch patterns in Sandbox and compare traces", "n8n / Flowise canvas in Chrome desktop-mode"],
    ios: ["Switch patterns in Sandbox and compare traces", "Request Desktop Website (aA menu) for builders"],
  },
  {
    n: 8,
    title: "Ship & share",
    emoji: "🚀",
    color: "#26c6da",
    what: "Export the agent config, deploy a webhook/WhatsApp/Telegram bot, demo to the cohort.",
    android: ["Export JSON → share via WhatsApp/Drive", "Deploy from Codespaces to Vercel/Render"],
    ios: ["Export JSON → AirDrop / share sheet", "Deploy from Codespaces; test bot in Telegram"],
  },
];

export const DEVICE_TIPS = {
  android: [
    "Chrome supports installable PWAs, so the lab behaves like a native app.",
    "Termux (F-Droid build) gives a real Linux shell: Python, Node, git, even Ollama for tiny local models.",
    "Developer options → keep screen awake while charging during long labs.",
    "Use a Bluetooth keyboard or DeX/desktop mode for comfortable coding.",
    "Budget phones: prefer cloud IDEs; keep 2 GB free storage for Termux packages.",
  ],
  ios: [
    "Safari 'Add to Home Screen' installs the lab as a full-screen web app.",
    "No native terminal — use a-Shell, iSH (Alpine emulation), Pyto or Pythonista, or cloud IDEs.",
    "Shortcuts app can trigger agent webhooks (Siri: 'Hey Siri, ask my agent…').",
    "iPad + Magic Keyboard + Codespaces is a near-laptop experience.",
    "Apple Intelligence & on-device models are great for privacy demos, but labs use Groq for speed.",
  ],
};

export const SANDBOXES = [
  {
    name: "PocketAgent Sandbox (this app)",
    emoji: "🧪",
    os: ["android", "ios"],
    cost: "Free (BYOK)",
    level: "Beginner",
    setup: ["Open 🧪 Sandbox", "Add Groq key in ⚙️ Settings", "Pick scenario → Run"],
    code: "",
  },
  {
    name: "Termux (Android)",
    emoji: "🐧",
    os: ["android"],
    cost: "Free",
    level: "Intermediate",
    setup: ["Install Termux from F-Droid", "Run the commands below", "Edit with nano or Acode editor"],
    code: "pkg update && pkg install python git nodejs\npip install groq\nexport GROQ_API_KEY=gsk_...\npython agent.py",
  },
  {
    name: "Pydroid 3 (Android)",
    emoji: "🐍",
    os: ["android"],
    cost: "Free / Pro",
    level: "Beginner",
    setup: ["Install from Play Store", "Pip → install 'groq' and 'requests'", "Paste the starter agent & run"],
    code: "",
  },
  {
    name: "a-Shell (iOS)",
    emoji: "🍎",
    os: ["ios"],
    cost: "Free",
    level: "Intermediate",
    setup: ["Install a-Shell from App Store", "pip install requests", "Run python agent.py with your key"],
    code: "pip install requests\nexport GROQ_API_KEY=gsk_...\npython3 agent.py",
  },
  {
    name: "iSH (iOS)",
    emoji: "🏔️",
    os: ["ios"],
    cost: "Free",
    level: "Advanced",
    setup: ["Install iSH (Alpine Linux shell)", "apk add python3 py3-pip", "Slower (emulated x86) — fine for small scripts"],
    code: "apk add python3 py3-pip git\npip3 install requests",
  },
  {
    name: "Pyto / Pythonista (iOS)",
    emoji: "📱",
    os: ["ios"],
    cost: "Free trial / Paid",
    level: "Beginner",
    setup: ["Install from App Store", "Use built-in editor & console", "Integrates with Shortcuts"],
    code: "",
  },
  {
    name: "GitHub Codespaces",
    emoji: "☁️",
    os: ["android", "ios"],
    cost: "Free monthly hours",
    level: "Intermediate",
    setup: ["github.com → repo → Code → Codespaces", "VS Code in the mobile browser", "Full Linux: Node, Python, Docker, MCP servers"],
    code: "npx create-next-app@latest my-agent\npip install langgraph langchain-groq",
  },
  {
    name: "Google Colab",
    emoji: "📓",
    os: ["android", "ios"],
    cost: "Free tier",
    level: "Beginner",
    setup: ["colab.research.google.com", "Notebook cells are thumb-friendly", "Store key in Colab Secrets 🔑"],
    code: "!pip install -q groq langgraph chromadb\nfrom google.colab import userdata\nkey = userdata.get('GROQ_API_KEY')",
  },
  {
    name: "Replit",
    emoji: "🌀",
    os: ["android", "ios"],
    cost: "Free / Paid",
    level: "Beginner",
    setup: ["Install Replit mobile app", "Create Python/Node repl", "Add GROQ_API_KEY in Secrets", "Deploy with one tap"],
    code: "",
  },
  {
    name: "n8n / Flowise (cloud)",
    emoji: "🧩",
    os: ["android", "ios"],
    cost: "Free trial / self-host",
    level: "No-code",
    setup: ["Open in mobile browser (desktop mode)", "Drag AI Agent + Groq Chat Model nodes", "Attach tools & vector store"],
    code: "",
  },
];

export const STARTER_AGENT_PY = `import os, json, requests, datetime

KEY = os.environ["GROQ_API_KEY"]
URL = "https://api.groq.com/openai/v1/chat/completions"

def get_time(city: str):               # a tool = plain function
    return {"city": city, "now": datetime.datetime.now().isoformat()}

TOOLS = [{"type": "function", "function": {
  "name": "get_time", "description": "Current time for a city",
  "parameters": {"type": "object",
    "properties": {"city": {"type": "string"}},
    "required": ["city"]}}}]

msgs = [{"role": "system", "content": "You are a helpful agent."},
        {"role": "user", "content": input("Ask: ")}]

for _ in range(5):                       # the agent loop
    r = requests.post(URL, headers={"Authorization": f"Bearer {KEY}"},
        json={"model": "llama-3.3-70b-versatile",
              "messages": msgs, "tools": TOOLS}).json()
    m = r["choices"][0]["message"]; msgs.append(m)
    if not m.get("tool_calls"):
        print("🤖", m["content"]); break
    for tc in m["tool_calls"]:           # act
        args = json.loads(tc["function"]["arguments"])
        out = get_time(**args)           # observe
        msgs.append({"role": "tool", "tool_call_id": tc["id"],
                     "content": json.dumps(out)})`;
