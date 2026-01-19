import React, { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 pixel-border bg-card p-4 box-glow"
      role="dialog"
      aria-labelledby="install-title"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 id="install-title" className="font-pixel text-xs text-primary">
          INSTALL APP
        </h3>
        <button
          onClick={handleDismiss}
          className="text-muted hover:text-foreground font-pixel text-xs"
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
      <p className="text-[10px] text-foreground/80 mb-3">
        Add this portfolio to your home screen for quick access!
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="retro-btn retro-btn-primary px-3 py-2 font-pixel text-[9px] uppercase flex-1 min-h-[44px]"
        >
          INSTALL
        </button>
        <button
          onClick={handleDismiss}
          className="retro-btn bg-muted text-foreground px-3 py-2 font-pixel text-[9px] uppercase min-h-[44px]"
        >
          LATER
        </button>
      </div>
    </div>
  );
};

