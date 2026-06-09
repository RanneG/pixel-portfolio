import React, { useEffect, useState } from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { useLanguage } from "../../contexts/LanguageContext";

const BIOS_LOAD_MS = 3800;

type Props = {
  onEnter: () => void;
};

function yearsExperience(work: { start: string; end: string }[]): number {
  const starts = work
    .map((w) => {
      const m = w.start.match(/\d{4}/);
      return m ? parseInt(m[0], 10) : null;
    })
    .filter((y): y is number => y !== null);
  if (starts.length === 0) return 6;
  const earliest = Math.min(...starts);
  return Math.max(1, new Date().getFullYear() - earliest);
}

export const BiosScreen: React.FC<Props> = ({ onEnter }) => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const exp = yearsExperience(data.workExperience ?? []);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(onEnter, BIOS_LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [onEnter]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : `${d}.`));
    }, 400);
    return () => window.clearInterval(tick);
  }, []);

  return (
    <div className="win98-bios" role="main" id="main-content" aria-busy="true">
      <div className="win98-bios-top">
        <div className="win98-bios-welcome">
          <p>{t("desktop.bios.welcome")}</p>
          <p style={{ color: "#aaa", fontSize: "0.9em" }}>{t("desktop.bios.hint")}</p>
        </div>
        <div className="win98-bios-logo" aria-hidden>
          ★ RG-98
        </div>
      </div>

      <dl className="win98-bios-specs">
        <dt>{t("desktop.bios.file")}: </dt>
        <dd>{t("desktop.bios.fileValue")}</dd>
        <dt>{t("desktop.bios.builtWith")}: </dt>
        <dd>React + Vite</dd>
        <dt>{t("desktop.bios.specialist")}: </dt>
        <dd>{data.subtitle?.split("//")[0]?.trim() || "Full-Stack Engineer"}</dd>
        <dt>{t("desktop.bios.experience")}: </dt>
        <dd>{exp}</dd>
        <dt>{t("desktop.bios.stack")}: </dt>
        <dd>TypeScript, Python, Tauri, MCP, RAG</dd>
        <dt>{t("desktop.bios.location")}: </dt>
        <dd>{data.contact.location}</dd>
      </dl>

      <div className="win98-bios-prompts">
        <p>
          {t("desktop.bios.loading")}
          {dots}
          <span className="win98-bios-blink">_</span>
        </p>
      </div>
    </div>
  );
};
