import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

const MEMES = [
  { name: "Dancing Baby", emoji: "👶" },
  { name: "I can has", emoji: "🐱" },
  { name: "Leekspin", emoji: "🥬" },
  { name: "Keyboard Cat", emoji: "🎹" },
  { name: "Longcat", emoji: "🐈" }
] as const;

export const RecycleBinContent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <p style={{ marginTop: 0, fontSize: 10, color: "#666" }}>{t("desktop.recycle.hint")}</p>
      <div className="win98-recycle-grid">
        {MEMES.map((m) => (
          <div key={m.name} className="win98-recycle-item">
            <span className="win98-recycle-emoji" aria-hidden>
              {m.emoji}
            </span>
            <span>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
