"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "./store";

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function StatusBar() {
  const { device } = useStore();
  const time = useClock();
  return (
    <div className={`status-bar ${device}`}>
      <span className="sb-time">{time}</span>
      {device === "ios" ? <span className="island" aria-hidden /> : <span className="punch" aria-hidden />}
      <span className="sb-icons" aria-hidden>
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></g></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path fill="currentColor" d="M7.5 2.2c2.1 0 4 .8 5.5 2.2l1.1-1.1A9.3 9.3 0 0 0 7.5.6 9.3 9.3 0 0 0 .9 3.3L2 4.4a7.7 7.7 0 0 1 5.5-2.2Zm0 3.1c1.3 0 2.4.5 3.3 1.3l1.1-1.1a6.3 6.3 0 0 0-8.8 0l1.1 1.1c.9-.8 2-1.3 3.3-1.3Zm0 3.1-1.6 1.6 1.6 1.6 1.6-1.6-1.6-1.6Z" /></svg>
        <span className="battery"><span /></span>
      </span>
    </div>
  );
}

export function NavBar() {
  const { device, open, app } = useStore();
  if (device === "ios") {
    return (
      <div className="home-indicator-wrap">
        <button className="home-indicator" aria-label="Go home" onClick={() => open("home")} />
      </div>
    );
  }
  return (
    <nav className="android-nav" aria-label="System navigation">
      <button aria-label="Back" onClick={() => open("home")} disabled={app === "home"}>◀</button>
      <button aria-label="Home" onClick={() => open("home")}>●</button>
      <button aria-label="Recents" onClick={() => open("settings")}>■</button>
    </nav>
  );
}

export function Phone({ children }: { children: ReactNode }) {
  const { device, toast } = useStore();
  return (
    <div className={`phone ${device}`}>
      <div className="phone-buttons" aria-hidden>
        <span className="btn-a" />
        <span className="btn-b" />
        <span className="btn-c" />
      </div>
      <div className="screen">
        <StatusBar />
        <div className="screen-body">{children}</div>
        <NavBar />
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}
