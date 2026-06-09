import React, { useEffect, useRef, useState } from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { useLanguage } from "../../contexts/LanguageContext";

const PASSWORD_LENGTH = 8;
const AUTOFILL_DOT_MS = 120;

type Props = {
  onConfirm: () => void;
};

export const LoginScreen: React.FC<Props> = ({ onConfirm }) => {
  const { data } = usePortfolioData();
  const { t } = useLanguage();
  const [dots, setDots] = useState("");
  const [ready, setReady] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let count = 0;
    const interval = window.setInterval(() => {
      count += 1;
      setDots("•".repeat(Math.min(count, PASSWORD_LENGTH)));
      if (count >= PASSWORD_LENGTH) {
        window.clearInterval(interval);
        setReady(true);
      }
    }, AUTOFILL_DOT_MS);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ready) return;
    confirmRef.current?.focus();
  }, [ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!ready) return;
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, onConfirm]);

  return (
    <div className="win98-login win98-root" role="main" id="main-content">
      <div className="win98-login-panel">
        <img
          className="win98-login-avatar"
          src="/images/browse-hero.png"
          alt=""
          width={80}
          height={80}
        />
        <p className="win98-login-label">{t("desktop.login.prompt")}</p>
        <div className="win98-login-row">
          <input
            className="win98-login-input"
            type="text"
            readOnly
            value={dots}
            aria-label={t("desktop.login.prompt")}
            tabIndex={-1}
          />
          <button
            ref={confirmRef}
            type="button"
            className="win98-btn"
            onClick={onConfirm}
            disabled={!ready}
          >
            {t("desktop.login.confirm")}
          </button>
        </div>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 8 }}>
          {data.name}
        </p>
      </div>
    </div>
  );
};
