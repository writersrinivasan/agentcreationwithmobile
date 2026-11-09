"use client";

import { useState } from "react";
import { AppHeader } from "../ui";
import { useStore } from "../store";
import { listModels } from "@/lib/client";

const FALLBACK_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3-32b"];

export function Settings() {
  const { groqKey, setGroqKey, model, setModel, device, setDevice, notify } = useStore();
  const [draft, setDraft] = useState(groqKey);
  const [show, setShow] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "bad">(groqKey ? "idle" : "idle");
  const [err, setErr] = useState("");

  async function save() {
    const k = draft.trim();
    if (!k) return;
    setStatus("checking");
    setErr("");
    try {
      const ms = await listModels(k);
      setModels(ms);
      setGroqKey(k);
      setStatus("ok");
      notify("Key verified & saved on this device ✅");
      if (ms.length && !ms.includes(model)) setModel(ms.includes("llama-3.3-70b-versatile") ? "llama-3.3-70b-versatile" : ms[0]);
    } catch (e) {
      setStatus("bad");
      setErr((e as Error).message);
    }
  }

  const options = Array.from(new Set([model, ...(models.length ? models : FALLBACK_MODELS)]));

  return (
    <div className="app">
      <AppHeader title="Settings" subtitle="Bring Your Own Key · device theme" color="#5f6c7b" />
      <div className="stack">
        <div className="settings-group">
          <div className="sg-title">🔑 Groq API key (BYOK)</div>
          <div className="sg-body">
            <div className="key-row">
              <input
                type={show ? "text" : "password"}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="gsk_…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Groq API key"
              />
              <button className="pill" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
            </div>
            <div className="row gap">
              <button className="cta grow" onClick={save} disabled={status === "checking" || !draft.trim()}>
                {status === "checking" ? "Checking…" : "Verify & save"}
              </button>
              {groqKey && (
                <button
                  className="pill danger"
                  onClick={() => {
                    setGroqKey("");
                    setDraft("");
                    setModels([]);
                    setStatus("idle");
                    notify("Key removed from this device");
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            {status === "ok" && <p className="ok">✅ Key works · {models.length} models available</p>}
            {status === "bad" && <p className="error">❌ {err}</p>}
            {groqKey && status === "idle" && <p className="ok">🔒 A key is saved on this device</p>}
            <a className="link" href="https://console.groq.com/keys" target="_blank" rel="noreferrer">Get a free key at console.groq.com ↗</a>
          </div>
        </div>

        <div className="settings-group">
          <div className="sg-title">🧠 Model</div>
          <div className="sg-body">
            <select value={model} onChange={(e) => setModel(e.target.value)} aria-label="Model">
              {options.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <p className="muted small">Tool-calling works best with llama-3.3-70b-versatile, gpt-oss or qwen3 models. Verify your key to load the live list.</p>
          </div>
        </div>

        <div className="settings-group">
          <div className="sg-title">📱 Phone theme</div>
          <div className="sg-body">
            <div className="seg">
              <button className={device === "ios" ? "on ios" : ""} onClick={() => setDevice("ios")}>🍎 iOS style</button>
              <button className={device === "android" ? "on android" : ""} onClick={() => setDevice("android")}>🤖 Android style</button>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="sg-title">🛡️ How BYOK works here</div>
          <div className="sg-body">
            <ul className="ticks small">
              <li>Your key is stored only in this browser&apos;s localStorage.</li>
              <li>Each request sends it in an <code>x-groq-key</code> header to this app&apos;s API route, which forwards it to Groq and never stores or logs it.</li>
              <li>Use a dedicated training key and set spending limits in the Groq console.</li>
              <li>Remove the key on shared devices when the session ends.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
