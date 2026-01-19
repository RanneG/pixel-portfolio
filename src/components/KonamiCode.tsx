import React, { useState, useEffect } from "react";

const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];

export const KonamiCode: React.FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activated) return;

      const newSequence = [...sequence, e.code];
      setSequence(newSequence);

      // Check if sequence matches
      if (newSequence.length === KONAMI_CODE.length) {
        if (newSequence.every((key, index) => key === KONAMI_CODE[index])) {
          setActivated(true);
          // Trigger celebration animation
          document.body.classList.add("konami-activated");
          setTimeout(() => {
            document.body.classList.remove("konami-activated");
            setSequence([]);
            setActivated(false);
          }, 5000);
        } else {
          // Reset if sequence doesn't match
          setSequence([]);
        }
      } else if (newSequence.length > KONAMI_CODE.length) {
        setSequence([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sequence, activated]);

  if (!activated) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="text-center space-y-4 pixel-fade-in">
        <h2 className="font-pixel text-2xl md:text-4xl text-primary neon-glow animate-pulse">
          ★ CHEAT CODE ACTIVATED! ★
        </h2>
        <p className="font-retro text-lg md:text-xl text-secondary">
          You found the secret! +1000 XP
        </p>
        <p className="font-pixel text-xs md:text-sm text-muted">
          The retro gods smile upon you...
        </p>
      </div>
    </div>
  );
};

