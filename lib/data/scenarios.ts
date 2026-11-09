import type { Pattern } from "../agent/framework";

export interface Scenario {
  id: string;
  industry: string;
  emoji: string;
  gradient: string;
  title: string;
  problem: string;
  agentName: string;
  instructions: string;
  tools: string[];
  pattern: Pattern;
  task: string;
  mobileFlow: string[];
  kpis: string[];
  guardrails: string[];
  stack: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "mfg",
    industry: "Manufacturing",
    emoji: "🏭",
    gradient: "linear-gradient(135deg,#ff9a44,#fc6076)",
    title: "Shop-floor Maintenance Copilot",
    problem: "Technicians lose time searching paper SOPs and calling supervisors when a CNC machine throws an error.",
    agentName: "MaintBot",
    instructions:
      "You are MaintBot, a maintenance copilot for Plant 7. Always check the SOP with knowledge_search before advising. Check spare parts with inventory_lookup. For any safety risk, advise stopping the machine first. Create a ticket for unresolved faults.",
    tools: ["knowledge_search", "inventory_lookup", "create_ticket", "get_datetime"],
    pattern: "react",
    task: "CNC-12 shows error E-217 and vibration is 5.1 mm/s. What should I do? Do we have spindle bearings (SKU-1001) in stock? Raise a ticket if needed.",
    mobileFlow: ["Technician scans QR on machine", "Speaks the error code (voice input)", "Agent retrieves SOP + checks stock via ERP MCP", "Ticket raised with photo; supervisor gets push alert"],
    kpis: ["MTTR ↓ 30%", "First-time fix ↑", "Unplanned downtime ↓"],
    guardrails: ["Safety-first instructions", "Human sign-off before restart", "Audit log of every tool call"],
    stack: ["Groq Llama", "RAG over SOP PDFs", "ERP MCP server", "PWA on rugged Android"],
  },
  {
    id: "health",
    industry: "Healthcare",
    emoji: "🏥",
    gradient: "linear-gradient(135deg,#43e97b,#38f9d7)",
    title: "Discharge Follow-up Assistant",
    problem: "Nurses must call every cardiac patient within 48 hours and triage warning signs consistently.",
    agentName: "CareCall",
    instructions:
      "You are CareCall, helping nurses with post-discharge follow-ups. Ground every answer in hospital policy using knowledge_search. Never change or recommend prescription changes. If red-flag symptoms are reported, clearly instruct to return to emergency immediately.",
    tools: ["knowledge_search", "get_datetime", "create_ticket"],
    pattern: "reflection",
    task: "Patient discharged yesterday after angioplasty reports mild breathlessness and a temperature of 38.7 C. What should the nurse advise and log?",
    mobileFlow: ["Nurse opens patient card on iPhone", "Agent drafts call script from policy", "Critic agent checks safety before showing", "Escalation ticket auto-created for red flags"],
    kpis: ["48h follow-up compliance ↑", "Readmissions ↓", "Nurse time saved"],
    guardrails: ["No prescribing", "Reflection/critic pass", "De-identified data", "Clinician approval"],
    stack: ["Groq", "Policy RAG", "EHR via FHIR MCP", "iOS Shortcuts for call logging"],
  },
  {
    id: "retail",
    industry: "Retail & E-commerce",
    emoji: "🛍️",
    gradient: "linear-gradient(135deg,#f093fb,#f5576c)",
    title: "Store Associate Returns Agent",
    problem: "Associates give inconsistent answers about return windows, store credit and loyalty perks.",
    agentName: "ShopPal",
    instructions:
      "You are ShopPal for UrbanMart associates. Use knowledge_search for policy, crm_lookup for customer tier, inventory_lookup for replacements. Be friendly and precise.",
    tools: ["knowledge_search", "crm_lookup", "inventory_lookup"],
    pattern: "supervisor",
    task: "Customer C-501 wants to return wireless earbuds (SKU-3300) bought 12 days ago without original packaging. What are the options, and can we offer a replacement?",
    mobileFlow: ["Associate scans receipt barcode", "Agent checks policy + CRM tier + stock", "Suggests refund/credit/replacement", "Sends customer a WhatsApp summary"],
    kpis: ["Handle time ↓", "CSAT ↑", "Policy errors ↓"],
    guardrails: ["Policy-grounded answers only", "Manager override for exceptions"],
    stack: ["Groq", "CRM + POS MCP servers", "WhatsApp Cloud API"],
  },
  {
    id: "bfsi",
    industry: "Banking & Finance",
    emoji: "🏦",
    gradient: "linear-gradient(135deg,#4facfe,#00f2fe)",
    title: "Loan Pre-qualification Agent",
    problem: "Field sales officers need instant EMI and eligibility guidance while meeting customers.",
    agentName: "LoanLens",
    instructions:
      "You are LoanLens for FinTrust field officers. Compute EMIs with emi_calculator, check KYC & fraud guidance with knowledge_search. Remind that final credit decisions need a human underwriter.",
    tools: ["emi_calculator", "calculator", "knowledge_search", "crm_lookup"],
    pattern: "plan_execute",
    task: "Customer C-503 wants a 15 lakh home-improvement loan at 10.5% for 60 months. Compute EMI, check if EMI fits within 40% of a monthly income of 1.2 lakh, and list KYC steps.",
    mobileFlow: ["Officer enters details on tablet/phone", "Planner splits: EMI → affordability → KYC", "Executor uses calculators & policy RAG", "Pre-qual PDF shared to customer"],
    kpis: ["Turnaround time ↓", "Lead conversion ↑", "Compliance errors ↓"],
    guardrails: ["Human underwriter", "No PII in prompts", "Fraud signal checks"],
    stack: ["Groq", "Core-banking MCP (read-only)", "Video-KYC app"],
  },
  {
    id: "agri",
    industry: "Agriculture",
    emoji: "🌾",
    gradient: "linear-gradient(135deg,#a8e063,#56ab2f)",
    title: "Krishi Mitra Crop Advisor",
    problem: "Farmers need timely, local-language advice on diseases, fertiliser and weather windows.",
    agentName: "KrishiMitra",
    instructions:
      "You are KrishiMitra, a crop advisory agent. Use knowledge_search for agronomy advisories and weather_forecast for spraying windows. Reply simply; offer a Tamil or Hindi translation line at the end.",
    tools: ["knowledge_search", "weather_forecast"],
    pattern: "react",
    task: "My paddy leaves have brown spots with yellow halo in Thanjavur. What should I do and is it safe to spray in the next 3 days?",
    mobileFlow: ["Farmer sends leaf photo + voice note on WhatsApp", "Agent retrieves advisory + weather MCP", "Replies in Tamil with dosage & timing", "Field officer gets weekly digest"],
    kpis: ["Crop loss ↓", "Advisory reach ↑", "Input cost ↓"],
    guardrails: ["Only approved chemicals", "Escalate unknown diseases to officer"],
    stack: ["Groq + vision model", "WhatsApp", "Weather MCP", "Multilingual prompts"],
  },
  {
    id: "logistics",
    industry: "Logistics & Supply Chain",
    emoji: "🚚",
    gradient: "linear-gradient(135deg,#f6d365,#fda085)",
    title: "Delivery Exception Resolver",
    problem: "Drivers and dispatchers waste time on failed deliveries and cold-chain incidents.",
    agentName: "RouteRanger",
    instructions:
      "You are RouteRanger for SwiftShip. Use knowledge_search for SLA rules, inventory_lookup for hub stock, weather_forecast for route risk, create_ticket for incidents.",
    tools: ["knowledge_search", "inventory_lookup", "weather_forecast", "create_ticket", "get_datetime"],
    pattern: "supervisor",
    task: "An insulin cold box shipment (SKU-4100) to Chennai had a temperature excursion of 25 minutes at 9 C. What does the SLA say, how many cold boxes are left at the hub, and raise an incident.",
    mobileFlow: ["Driver app detects sensor alert", "Supervisor agent routes to Researcher + Operator", "Incident ticket + customer reschedule link", "Dispatcher approves on phone"],
    kpis: ["On-time delivery ↑", "Spoilage ↓", "Re-attempt cost ↓"],
    guardrails: ["Human approval for refunds", "GPS/photo evidence required"],
    stack: ["Groq", "IoT webhook", "TMS MCP server", "Telegram for dispatchers"],
  },
  {
    id: "edu",
    industry: "Education & Training",
    emoji: "🎓",
    gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)",
    title: "Agent-Builder Tutor",
    problem: "Learners need a patient tutor that explains RAG, MCP and orchestration with hands-on checks.",
    agentName: "TutorBot",
    instructions:
      "You are TutorBot teaching agent building on mobile phones. Use knowledge_search for fundamentals. Explain with analogies, give a 3-question quiz at the end.",
    tools: ["knowledge_search"],
    pattern: "reflection",
    task: "Explain the difference between RAG and MCP to a first-year student who only has an iPhone, and suggest a 1-hour practice plan.",
    mobileFlow: ["Learner asks in chat", "Agent explains + quiz", "Critic agent improves clarity", "Progress saved to Learn Lab"],
    kpis: ["Course completion ↑", "Quiz scores ↑"],
    guardrails: ["Age-appropriate", "Cite sources"],
    stack: ["Groq", "Course notes RAG", "PWA"],
  },
  {
    id: "hr",
    industry: "HR & Operations",
    emoji: "🧑‍💼",
    gradient: "linear-gradient(135deg,#ff758c,#ff7eb3)",
    title: "Field-Staff HR Helpdesk",
    problem: "Frontline staff without laptops can't easily get answers about leave, payroll and shifts.",
    agentName: "PeoplePal",
    instructions:
      "You are PeoplePal. Answer HR questions politely, compute leave/pay with calculator, and create tickets for anything requiring HR action.",
    tools: ["calculator", "create_ticket", "get_datetime"],
    pattern: "react",
    task: "I worked 9 overtime hours this month at 1.5x of my hourly rate of 220 rupees. How much overtime pay is that? Please raise a ticket to HR to confirm it is in payroll.",
    mobileFlow: ["Employee asks on Teams/WhatsApp", "Agent computes & explains", "Ticket to HRMS via MCP", "Push notification when resolved"],
    kpis: ["HR ticket volume ↓", "Employee satisfaction ↑"],
    guardrails: ["No salary data of others", "Role-based access"],
    stack: ["Groq", "HRMS MCP", "Teams mobile"],
  },
  {
    id: "energy",
    industry: "Energy & Utilities",
    emoji: "⚡",
    gradient: "linear-gradient(135deg,#f12711,#f5af19)",
    title: "Grid Field Inspection Agent",
    problem: "Linemen inspect transformers in remote areas and must report faults & weather risk fast.",
    agentName: "GridGuard",
    instructions:
      "You are GridGuard for utility field inspectors. Check weather risk with weather_forecast, compute load with calculator and raise prioritised tickets.",
    tools: ["weather_forecast", "calculator", "create_ticket"],
    pattern: "plan_execute",
    task: "Transformer T-88 in Madurai is at 92 kVA load on a 100 kVA rating. What is the load percentage, is a storm expected in 3 days, and raise a ticket with the right priority.",
    mobileFlow: ["Inspector photographs nameplate", "Agent plans: load → weather → ticket", "Offline-first queue syncs when signal returns"],
    kpis: ["Outage minutes ↓", "Inspection throughput ↑"],
    guardrails: ["Lock-out/tag-out reminders", "Supervisor review for critical"],
    stack: ["Groq", "SCADA read-only MCP", "Offline PWA"],
  },
  {
    id: "hospitality",
    industry: "Hospitality & Travel",
    emoji: "🏨",
    gradient: "linear-gradient(135deg,#84fab0,#8fd3f4)",
    title: "Concierge Agent",
    problem: "Guests want instant local recommendations and service requests in their own language.",
    agentName: "Concierge",
    instructions:
      "You are a hotel concierge agent. Use weather_forecast for plans, get_datetime for timing, create_ticket for room service or housekeeping. Be warm and concise.",
    tools: ["weather_forecast", "get_datetime", "create_ticket"],
    pattern: "react",
    task: "I'm in Chennai for 3 days. Suggest which day is best for a beach visit based on weather, and please request extra towels to room 412.",
    mobileFlow: ["Guest scans room QR → web chat", "Agent plans with weather MCP", "Housekeeping ticket created", "Staff app notified"],
    kpis: ["Guest NPS ↑", "Request resolution time ↓"],
    guardrails: ["No payment capture in chat", "Escalate complaints to duty manager"],
    stack: ["Groq", "PMS MCP", "QR web app"],
  },
];
