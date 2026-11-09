export type Fit = "Android" | "iOS" | "Browser";

export interface CatalogItem {
  name: string;
  cat: string;
  desc: string;
  fit: Fit[];
  level: "No-code" | "Low-code" | "Pro-code";
  url: string;
}

export const CATEGORIES = [
  { id: "llm", label: "LLM APIs", emoji: "🧠", color: "#ff6b9d" },
  { id: "framework", label: "Agent Frameworks", emoji: "🛠️", color: "#7c4dff" },
  { id: "nocode", label: "No/Low-code Builders", emoji: "🧩", color: "#00bfa5" },
  { id: "rag", label: "RAG & Vector DBs", emoji: "📚", color: "#ffab00" },
  { id: "mcp", label: "MCP Ecosystem", emoji: "🔌", color: "#ff7043" },
  { id: "orchestration", label: "Orchestration", emoji: "🎼", color: "#ec407a" },
  { id: "mobile-ide", label: "Mobile IDEs & Shells", emoji: "📱", color: "#29b6f6" },
  { id: "cloud-ide", label: "Cloud IDEs & Notebooks", emoji: "☁️", color: "#5c6bc0" },
  { id: "deploy", label: "Deploy & Hosting", emoji: "🚀", color: "#26a69a" },
  { id: "channels", label: "Mobile Channels", emoji: "💬", color: "#66bb6a" },
  { id: "ondevice", label: "On-device AI", emoji: "🔋", color: "#8d6e63" },
  { id: "observe", label: "Eval & Observability", emoji: "🔍", color: "#ab47bc" },
] as const;

const A: Fit[] = ["Android", "iOS", "Browser"];

export const CATALOG: CatalogItem[] = [
  // LLM APIs
  { name: "Groq", cat: "llm", desc: "Ultra-fast LPU inference for open models (Llama, Qwen, GPT-OSS, Kimi). Free tier — powers this lab via BYOK.", fit: A, level: "Low-code", url: "https://console.groq.com" },
  { name: "Anthropic Claude", cat: "llm", desc: "Strong reasoning, tool use and native MCP support. Claude mobile apps on Android & iOS.", fit: A, level: "Low-code", url: "https://www.anthropic.com/api" },
  { name: "OpenAI", cat: "llm", desc: "GPT models, Responses API, Agents SDK, function calling.", fit: A, level: "Low-code", url: "https://platform.openai.com" },
  { name: "Google Gemini", cat: "llm", desc: "Multimodal models; AI Studio works well in mobile browsers.", fit: A, level: "Low-code", url: "https://aistudio.google.com" },
  { name: "OpenRouter", cat: "llm", desc: "One key, hundreds of models — great for comparing models from a phone.", fit: A, level: "Low-code", url: "https://openrouter.ai" },
  { name: "Mistral", cat: "llm", desc: "European open-weight and API models with function calling.", fit: A, level: "Low-code", url: "https://console.mistral.ai" },

  // Frameworks
  { name: "LangGraph", cat: "framework", desc: "Graph-based stateful agents & multi-agent workflows (Python/JS). Industry favourite for orchestration.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://langchain-ai.github.io/langgraph/" },
  { name: "LangChain", cat: "framework", desc: "Building blocks: models, tools, retrievers, memory. ChatGroq integration.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://python.langchain.com" },
  { name: "CrewAI", cat: "framework", desc: "Role-based multi-agent crews (researcher, writer, reviewer…).", fit: ["Android", "Browser"], level: "Pro-code", url: "https://www.crewai.com" },
  { name: "Microsoft AutoGen / Agent Framework", cat: "framework", desc: "Conversational multi-agent systems, group chat and teams.", fit: ["Browser"], level: "Pro-code", url: "https://microsoft.github.io/autogen/" },
  { name: "OpenAI Agents SDK", cat: "framework", desc: "Lightweight agents, handoffs, guardrails and tracing; works with OpenAI-compatible APIs like Groq.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://openai.github.io/openai-agents-python/" },
  { name: "Claude Agent SDK", cat: "framework", desc: "Build agents on the same harness as Claude Code: tools, MCP, subagents.", fit: ["Browser"], level: "Pro-code", url: "https://docs.anthropic.com" },
  { name: "Google ADK", cat: "framework", desc: "Agent Development Kit for multi-agent systems on Gemini/Vertex.", fit: ["Browser"], level: "Pro-code", url: "https://google.github.io/adk-docs/" },
  { name: "Vercel AI SDK", cat: "framework", desc: "TypeScript toolkit for streaming chat, tools and agents in Next.js apps.", fit: ["Browser"], level: "Pro-code", url: "https://ai-sdk.dev" },
  { name: "Mastra", cat: "framework", desc: "TypeScript agent framework with workflows, RAG and evals.", fit: ["Browser"], level: "Pro-code", url: "https://mastra.ai" },
  { name: "PydanticAI", cat: "framework", desc: "Type-safe Python agents with structured outputs.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://ai.pydantic.dev" },
  { name: "smolagents", cat: "framework", desc: "Hugging Face's minimal code-agents library — light enough for Termux.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://huggingface.co/docs/smolagents" },
  { name: "Agno", cat: "framework", desc: "Fast Python multi-agent framework with memory and knowledge.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://www.agno.com" },
  { name: "PocketAgent (this app)", cat: "framework", desc: "Tiny TypeScript framework in this repo: ReAct, Plan-Execute, Supervisor, Reflection with traces.", fit: A, level: "Low-code", url: "#" },

  // No-code
  { name: "n8n", cat: "nocode", desc: "Workflow automation with AI Agent nodes, Groq model, vector stores & MCP nodes.", fit: A, level: "No-code", url: "https://n8n.io" },
  { name: "Flowise", cat: "nocode", desc: "Drag-and-drop LangChain/LlamaIndex agent & RAG flows.", fit: A, level: "No-code", url: "https://flowiseai.com" },
  { name: "Langflow", cat: "nocode", desc: "Visual builder for agents, RAG and MCP servers.", fit: A, level: "No-code", url: "https://www.langflow.org" },
  { name: "Dify", cat: "nocode", desc: "LLM app platform: agents, workflows, knowledge bases, Groq provider.", fit: A, level: "No-code", url: "https://dify.ai" },
  { name: "Botpress", cat: "nocode", desc: "Conversational agents for WhatsApp, Telegram, web.", fit: A, level: "No-code", url: "https://botpress.com" },
  { name: "Make / Zapier", cat: "nocode", desc: "Connect thousands of apps; AI steps and agents; mobile-friendly dashboards.", fit: A, level: "No-code", url: "https://zapier.com/agents" },
  { name: "Microsoft Copilot Studio", cat: "nocode", desc: "Enterprise agents on M365 / Teams with connectors.", fit: A, level: "No-code", url: "https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio" },
  { name: "Custom GPTs / Gems / Claude Projects", cat: "nocode", desc: "Instruction + knowledge agents built entirely inside mobile chat apps.", fit: A, level: "No-code", url: "https://claude.ai" },
  { name: "Apple Shortcuts", cat: "nocode", desc: "iOS automation: call agent webhooks with Siri, share sheet or NFC tags.", fit: ["iOS"], level: "No-code", url: "https://support.apple.com/guide/shortcuts/welcome/ios" },
  { name: "Tasker / MacroDroid", cat: "nocode", desc: "Android automation that can trigger HTTP calls to your agent.", fit: ["Android"], level: "No-code", url: "https://tasker.joaoapps.com" },

  // RAG
  { name: "Chroma", cat: "rag", desc: "Open-source embedding DB; pip-installable for Colab/Codespaces.", fit: ["Browser", "Android"], level: "Pro-code", url: "https://www.trychroma.com" },
  { name: "Pinecone", cat: "rag", desc: "Managed vector DB with a generous free tier and serverless indexes.", fit: A, level: "Low-code", url: "https://www.pinecone.io" },
  { name: "Qdrant", cat: "rag", desc: "High-performance vector search with free cloud cluster.", fit: A, level: "Pro-code", url: "https://qdrant.tech" },
  { name: "Supabase pgvector", cat: "rag", desc: "Postgres + vectors + auth; manage from the mobile dashboard.", fit: A, level: "Low-code", url: "https://supabase.com" },
  { name: "LlamaIndex", cat: "rag", desc: "Data framework for ingestion, indexing, retrieval and agentic RAG.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://www.llamaindex.ai" },
  { name: "Weaviate", cat: "rag", desc: "Vector DB with hybrid search and built-in modules.", fit: A, level: "Pro-code", url: "https://weaviate.io" },
  { name: "NotebookLM", cat: "rag", desc: "Zero-code RAG over your sources on mobile — ideal to *feel* grounding before building it.", fit: A, level: "No-code", url: "https://notebooklm.google.com" },

  // MCP
  { name: "Model Context Protocol spec", cat: "mcp", desc: "Open standard: hosts, clients, servers; tools, resources, prompts over JSON-RPC.", fit: A, level: "Pro-code", url: "https://modelcontextprotocol.io" },
  { name: "MCP Python SDK (FastMCP)", cat: "mcp", desc: "Build an MCP server in ~10 lines — runs in Termux or Codespaces.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://github.com/modelcontextprotocol/python-sdk" },
  { name: "MCP TypeScript SDK", cat: "mcp", desc: "Official TS SDK for servers & clients (stdio / Streamable HTTP).", fit: ["Browser"], level: "Pro-code", url: "https://github.com/modelcontextprotocol/typescript-sdk" },
  { name: "MCP Inspector", cat: "mcp", desc: "Debug UI to list and call tools on any MCP server.", fit: ["Browser"], level: "Low-code", url: "https://github.com/modelcontextprotocol/inspector" },
  { name: "MCP Server Registry", cat: "mcp", desc: "Directory of community servers: GitHub, Slack, Postgres, Drive, Maps…", fit: A, level: "Low-code", url: "https://github.com/modelcontextprotocol/servers" },
  { name: "Claude mobile + connectors", cat: "mcp", desc: "Use remote MCP connectors from the Claude app on your phone.", fit: ["Android", "iOS"], level: "No-code", url: "https://claude.ai" },
  { name: "Cloudflare remote MCP", cat: "mcp", desc: "Deploy remote MCP servers with OAuth on Workers.", fit: ["Browser"], level: "Pro-code", url: "https://developers.cloudflare.com/agents/" },

  // Orchestration
  { name: "LangGraph Studio / Platform", cat: "orchestration", desc: "Visualise and deploy stateful graphs with human-in-the-loop.", fit: ["Browser"], level: "Pro-code", url: "https://www.langchain.com/langgraph" },
  { name: "Temporal", cat: "orchestration", desc: "Durable execution for long-running agent workflows.", fit: ["Browser"], level: "Pro-code", url: "https://temporal.io" },
  { name: "Inngest", cat: "orchestration", desc: "Event-driven steps and AgentKit for TypeScript.", fit: ["Browser"], level: "Pro-code", url: "https://www.inngest.com" },
  { name: "A2A protocol", cat: "orchestration", desc: "Agent-to-Agent protocol for agents across vendors to collaborate.", fit: ["Browser"], level: "Pro-code", url: "https://a2a-protocol.org" },
  { name: "Prefect", cat: "orchestration", desc: "Python workflow orchestration for data + AI pipelines.", fit: ["Browser"], level: "Pro-code", url: "https://www.prefect.io" },

  // Mobile IDE
  { name: "Termux", cat: "mobile-ide", desc: "Full Linux terminal on Android (install from F-Droid).", fit: ["Android"], level: "Pro-code", url: "https://termux.dev" },
  { name: "Acode", cat: "mobile-ide", desc: "Code editor for Android with Git & FTP plugins.", fit: ["Android"], level: "Pro-code", url: "https://acode.app" },
  { name: "Pydroid 3", cat: "mobile-ide", desc: "Python 3 IDE with pip for Android.", fit: ["Android"], level: "Low-code", url: "https://play.google.com/store/apps/details?id=ru.iiec.pydroid3" },
  { name: "a-Shell", cat: "mobile-ide", desc: "Unix-like terminal for iOS with Python, Lua, C.", fit: ["iOS"], level: "Pro-code", url: "https://holzschu.github.io/a-Shell_iOS/" },
  { name: "iSH", cat: "mobile-ide", desc: "Alpine Linux shell emulated on iOS.", fit: ["iOS"], level: "Pro-code", url: "https://ish.app" },
  { name: "Pyto / Pythonista", cat: "mobile-ide", desc: "Python IDEs for iPhone/iPad with Shortcuts integration.", fit: ["iOS"], level: "Low-code", url: "https://pyto.app" },
  { name: "Working Copy", cat: "mobile-ide", desc: "Powerful Git client for iOS.", fit: ["iOS"], level: "Low-code", url: "https://workingcopy.app" },

  // Cloud IDE
  { name: "GitHub Codespaces", cat: "cloud-ide", desc: "VS Code + Linux container in any mobile browser.", fit: A, level: "Pro-code", url: "https://github.com/features/codespaces" },
  { name: "Google Colab", cat: "cloud-ide", desc: "Free notebooks with GPUs and Secrets for API keys.", fit: A, level: "Low-code", url: "https://colab.research.google.com" },
  { name: "Replit", cat: "cloud-ide", desc: "Mobile app + AI agent that builds & deploys apps.", fit: A, level: "Low-code", url: "https://replit.com" },
  { name: "StackBlitz / bolt.new", cat: "cloud-ide", desc: "Node in the browser (WebContainers) — run Next.js on a phone.", fit: A, level: "Low-code", url: "https://stackblitz.com" },
  { name: "Hugging Face Spaces", cat: "cloud-ide", desc: "Host Gradio/Streamlit agent demos for free.", fit: A, level: "Low-code", url: "https://huggingface.co/spaces" },
  { name: "Kaggle Notebooks", cat: "cloud-ide", desc: "Free notebooks with datasets — good RAG practice data.", fit: A, level: "Low-code", url: "https://www.kaggle.com/code" },

  // Deploy
  { name: "Vercel", cat: "deploy", desc: "Deploy this Next.js lab in one click; mobile dashboard.", fit: A, level: "Low-code", url: "https://vercel.com" },
  { name: "Render / Railway", cat: "deploy", desc: "Host Python agents, MCP servers and n8n/Flowise.", fit: A, level: "Low-code", url: "https://render.com" },
  { name: "Cloudflare Workers", cat: "deploy", desc: "Edge functions, Durable Objects and Agents SDK.", fit: A, level: "Pro-code", url: "https://workers.cloudflare.com" },
  { name: "Supabase Edge Functions", cat: "deploy", desc: "Deno functions next to your pgvector data.", fit: A, level: "Pro-code", url: "https://supabase.com/edge-functions" },
  { name: "Expo / React Native", cat: "deploy", desc: "Turn your agent into a native Android/iOS app; preview with Expo Go.", fit: A, level: "Pro-code", url: "https://expo.dev" },
  { name: "Flutter", cat: "deploy", desc: "Cross-platform native UI; Gemini/Firebase AI integrations.", fit: A, level: "Pro-code", url: "https://flutter.dev" },

  // Channels
  { name: "WhatsApp Cloud API", cat: "channels", desc: "Reach field workers & customers where they already are.", fit: A, level: "Low-code", url: "https://developers.facebook.com/docs/whatsapp/cloud-api" },
  { name: "Telegram Bot API", cat: "channels", desc: "Fastest way to ship a mobile agent — create with @BotFather.", fit: A, level: "Low-code", url: "https://core.telegram.org/bots" },
  { name: "Slack / Teams", cat: "channels", desc: "Enterprise chat agents with mobile apps.", fit: A, level: "Low-code", url: "https://api.slack.com" },
  { name: "Twilio (SMS/Voice)", cat: "channels", desc: "Voice agents and SMS for feature phones too.", fit: A, level: "Pro-code", url: "https://www.twilio.com" },
  { name: "PWA (this app)", cat: "channels", desc: "Installable web app on both Android and iOS home screens.", fit: A, level: "Pro-code", url: "#" },

  // On-device
  { name: "Ollama in Termux", cat: "ondevice", desc: "Run 1–3B models locally on flagship Android phones.", fit: ["Android"], level: "Pro-code", url: "https://ollama.com" },
  { name: "MLC Chat / LLM", cat: "ondevice", desc: "Run LLMs natively on Android & iOS GPUs.", fit: ["Android", "iOS"], level: "Low-code", url: "https://llm.mlc.ai" },
  { name: "Google AI Edge / Gemini Nano", cat: "ondevice", desc: "On-device inference APIs for Android (MediaPipe LLM, AICore).", fit: ["Android"], level: "Pro-code", url: "https://ai.google.dev/edge" },
  { name: "Apple Foundation Models", cat: "ondevice", desc: "On-device Apple Intelligence model framework for iOS apps.", fit: ["iOS"], level: "Pro-code", url: "https://developer.apple.com/apple-intelligence/" },
  { name: "WebLLM", cat: "ondevice", desc: "LLMs in the browser via WebGPU — private, offline demos.", fit: ["Browser"], level: "Pro-code", url: "https://webllm.mlc.ai" },
  { name: "PocketPal / Private LLM", cat: "ondevice", desc: "Chat with small GGUF models offline on phones.", fit: ["Android", "iOS"], level: "No-code", url: "https://github.com/a-ghorbani/pocketpal-ai" },

  // Observe
  { name: "LangSmith", cat: "observe", desc: "Tracing, datasets and evals for LLM apps.", fit: A, level: "Low-code", url: "https://smith.langchain.com" },
  { name: "Langfuse", cat: "observe", desc: "Open-source tracing, prompt management and evals.", fit: A, level: "Low-code", url: "https://langfuse.com" },
  { name: "Arize Phoenix", cat: "observe", desc: "Open-source observability & RAG evaluation.", fit: ["Browser"], level: "Pro-code", url: "https://phoenix.arize.com" },
  { name: "Ragas", cat: "observe", desc: "Metrics for RAG: faithfulness, answer relevance, context precision.", fit: ["Android", "Browser"], level: "Pro-code", url: "https://docs.ragas.io" },
  { name: "Promptfoo", cat: "observe", desc: "Test prompts, red-team agents, CI evals.", fit: ["Browser"], level: "Pro-code", url: "https://www.promptfoo.dev" },
];
