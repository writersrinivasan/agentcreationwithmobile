"use client";

import { useEffect, useState } from "react";
import { StoreProvider, useStore, type AppId } from "@/components/store";
import { Phone } from "@/components/Phone";
import { HomeScreen, APPS } from "@/components/HomeScreen";
import { Explore } from "@/components/apps/Explore";
import { Sandbox } from "@/components/apps/Sandbox";
import { Toolkit } from "@/components/apps/Toolkit";
import { Industry } from "@/components/apps/Industry";
import { Learn } from "@/components/apps/Learn";
import { Assistant } from "@/components/apps/Assistant";
import { Settings } from "@/components/apps/Settings";

const SCREENS: Record<Exclude<AppId, "home">, () => React.ReactElement> = {
  explore: Explore,
  sandbox: Sandbox,
  toolkit: Toolkit,
  industry: Industry,
  learn: Learn,
  assistant: Assistant,
  settings: Settings,
};

function Shell() {
  const { app, open, device, setDevice } = useStore();
  const Screen = app === "home" ? HomeScreen : SCREENS[app];
  return (
    <main className={`stage ${device}`}>
      <div className="blobs" aria-hidden><i /><i /><i /><i /></div>
      <aside className="side">
        <div className="brand">
          <img src="/icon.svg" alt="" width={44} height={44} />
          <div>
            <h1>PocketAgent Lab</h1>
            <p>Create AI agents from your phone</p>
          </div>
        </div>
        <p className="side-lead">
          A training lab for participants to design, run and ship agents using only an <b>Android</b> or <b>iPhone</b> — with a live sandbox,
          RAG, MCP, orchestration patterns and a Groq-powered assistant (BYOK).
        </p>
        <div className="seg side-seg">
          <button className={device === "ios" ? "on ios" : ""} onClick={() => setDevice("ios")}>🍎 iPhone</button>
          <button className={device === "android" ? "on android" : ""} onClick={() => setDevice("android")}>🤖 Android</button>
        </div>
        <nav className="side-nav">
          {APPS.map((a) => (
            <button key={a.id} className={app === a.id ? "on" : ""} onClick={() => open(a.id)}>
              <span className="sn-icon" style={{ background: a.bg }}>{a.emoji}</span>
              <span>
                <b>{a.label}</b>
                <small>{a.blurb}</small>
              </span>
            </button>
          ))}
        </nav>
        <p className="side-foot">Open this page on your phone for the full-screen app experience. Add it to your home screen to install.</p>
      </aside>
      <Phone>
        <div key={app} className="screen-anim">
          <Screen />
        </div>
      </Phone>
    </main>
  );
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="boot">📱</div>;
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
