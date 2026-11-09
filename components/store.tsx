"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Scenario } from "@/lib/data/scenarios";

export type AppId = "home" | "explore" | "sandbox" | "toolkit" | "industry" | "learn" | "assistant" | "settings";
export type Device = "ios" | "android";

interface Store {
  groqKey: string;
  setGroqKey: (k: string) => void;
  model: string;
  setModel: (m: string) => void;
  device: Device;
  setDevice: (d: Device) => void;
  app: AppId;
  open: (a: AppId) => void;
  prefill: Scenario | null;
  tryScenario: (s: Scenario) => void;
  clearPrefill: () => void;
  toast: string;
  notify: (t: string) => void;
}

const Ctx = createContext<Store | null>(null);

const read = (k: string, d: string) => {
  try {
    return localStorage.getItem(k) ?? d;
  } catch {
    return d;
  }
};
const write = (k: string, v: string) => {
  try {
    if (v) localStorage.setItem(k, v);
    else localStorage.removeItem(k);
  } catch {}
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [groqKey, _setKey] = useState("");
  const [model, _setModel] = useState("llama-3.3-70b-versatile");
  const [device, _setDevice] = useState<Device>("ios");
  const [app, setApp] = useState<AppId>("home");
  const [prefill, setPrefill] = useState<Scenario | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    _setKey(read("pal.groqKey", ""));
    _setModel(read("pal.model", "llama-3.3-70b-versatile"));
    const d = read("pal.device", "");
    if (d === "ios" || d === "android") _setDevice(d);
    else if (/android/i.test(navigator.userAgent)) _setDevice("android");
    // Deep links for trainers: /?app=sandbox, /?app=learn&device=android
    const qs = new URLSearchParams(window.location.search);
    const a = qs.get("app") as AppId | null;
    if (a && ["explore", "sandbox", "toolkit", "industry", "learn", "assistant", "settings"].includes(a)) setApp(a);
    const qd = qs.get("device");
    if (qd === "ios" || qd === "android") _setDevice(qd);
  }, []);

  const notify = useCallback((t: string) => {
    setToast(t);
    setTimeout(() => setToast(""), 2600);
  }, []);

  const value: Store = {
    groqKey,
    setGroqKey: (k) => {
      _setKey(k);
      write("pal.groqKey", k);
    },
    model,
    setModel: (m) => {
      _setModel(m);
      write("pal.model", m);
    },
    device,
    setDevice: (d) => {
      _setDevice(d);
      write("pal.device", d);
    },
    app,
    open: setApp,
    prefill,
    tryScenario: (s) => {
      setPrefill(s);
      setApp("sandbox");
    },
    clearPrefill: () => setPrefill(null),
    toast,
    notify,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}
