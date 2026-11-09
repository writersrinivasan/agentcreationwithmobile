# 📱 PocketAgent Lab

A colourful, phone-themed Next.js web app for teaching training participants to **create AI agents using only their Android or iOS phone**. It includes a live agent sandbox, RAG, MCP and orchestration labs, and a Groq-powered assistant that uses each participant's own API key (BYOK).

## Run it
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```
Then open ⚙️ **Settings** → paste a Groq key from https://console.groq.com/keys → **Verify & save**.

On a laptop the app renders inside an iPhone- or Android-style phone frame. On a real phone it goes full screen. Participants can **Add to Home Screen** to install it as a PWA.

## The phone "apps"
| App | What it covers |
|---|---|
| 🔭 **Explore** | The participant journey (8 stages) with separate Android and iOS steps, personas, the sandbox environments that work on each OS, and a 30-line starter Python agent |
| 🧪 **Sandbox** | Build an agent (instructions, tools, pattern), run it live on Groq, and inspect the full trace: thoughts, tool calls, MCP JSON-RPC envelopes, plans, critiques. Supports voice input and JSON export. |
| 🧬 **Learn Lab** | Modules on RAG, MCP, Orchestration, Tools & Memory, and Evals & Safety, each with a quiz. Also: an in-browser **RAG Lab** (chunk → BM25 → grounded answer), an **MCP handshake simulator**, a gallery of orchestration patterns, the **Possibilities & Probabilities** matrix, and a 4-week roadmap |
| 🏭 **Industry** | 10 industrial scenarios (manufacturing, healthcare, retail, banking, agriculture, logistics, education, HR, energy, hospitality), each with a mobile flow, KPIs and guardrails. **Try in Sandbox** opens the scenario pre-filled. |
| 🧰 **Toolkit** | Over 80 tools, frameworks and platforms across 12 categories, filterable by platform and level |
| 🤖 **AI Buddy** | A streaming Groq chat coach for building agents on mobile |
| ⚙️ **Settings** | Save the BYOK key, pick a model, switch between the iOS and Android themes |

Deep links for trainers: `/?app=sandbox`, `/?app=learn&device=android`, etc.

## Architecture
```
app/api/agent   → PocketAgent framework run (server)  ─┐
app/api/chat    → Groq SSE streaming proxy             ├─ key arrives per request in the x-groq-key header and is never stored
app/api/models  → key check + model list               ─┘
lib/agent/framework.ts → ReAct · Plan-and-Execute · Supervisor (multi-agent) · Reflection, with traces
lib/agent/tools.ts     → native tools + simulated MCP servers (ERP, CRM, weather, service desk)
lib/rag.ts             → dependency-free chunking + BM25 retrieval (browser and server)
lib/data/*             → journey, catalogue, scenarios, learning content
components/            → phone shell, home screen, the apps
```

## BYOK notes
- The key is stored only in the participant's browser (localStorage).
- The API routes forward it to Groq and never store or log it.
- Recommend separate training keys with spending limits, and removing the key on shared devices.

## Deploy
Push the project to GitHub, then import it on Vercel. No environment variables are needed, because every user brings their own key.
