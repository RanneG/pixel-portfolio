import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/vibeBrutalistBrowse.css";

async function clearDevServiceWorkersAndCaches(): Promise<void> {
  if (!import.meta.env.DEV) return;
  if ("serviceWorker" in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  }
}

/**
 * Defer loading `App` until dev SWs are gone so a stale worker cannot serve HTML
 * for JS (which breaks Vite + HMR and can surface as duplicate-React / hook errors).
 */
async function bootstrap(): Promise<void> {
  await clearDevServiceWorkersAndCaches();
  const { default: App } = await import("./App");
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      void navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}

void bootstrap();
