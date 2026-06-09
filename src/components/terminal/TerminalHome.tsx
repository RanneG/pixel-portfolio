/**
 * Interactive terminal shell (v1 stub commands).
 * Glass terminal UI adapted from Uiverse.io (author: louloudev59).
 */
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { useAchievementTracker } from "../../hooks/useAchievementTracker";
import { analytics } from "../../utils/analytics";
import { resolveFormspreeId, submitPortfolioContact, validateContactStep } from "../../utils/formspreeSubmit";
import { soundManager } from "../../utils/soundManager";
import { parseCli } from "./terminalCommandParser";
import { completeCommandPrefix, runTerminalCommand, type CommandOutcome } from "./terminalCommands";
import styles from "./TerminalHome.module.css";

type Block =
  | { type: "welcome"; lines: string[] }
  | { type: "cmd"; text: string }
  | { type: "out"; lines: string[] };

const WELCOME: Block = {
  type: "welcome",
  lines: [
    "Welcome to Ranne's portfolio terminal.",
    "Prefer a normal site? Open the menu (bottom-right) → Browse site.",
    "No internet? Open the Internet desktop icon for the offline dino game.",
    "Type `help` for commands; `help <command>` for flags (e.g. `help experience`).",
    "Send a message with:  contact --send  (then follow the prompts; cancel or abort to exit).",
  ],
};

/** Extra `ch` so the native caret always has room after the last character. */
const INPUT_CH_PAD = 1;

/** Cap tab count (in-memory only; avoids runaway UI). */
const MAX_TABS = 8;

/** Visible tab title (Windows Terminal style: same label per tab). */
const TAB_LABEL = "ranne@portfolio";

/** Multi-step Formspree message flow (terminal only). */
export type ContactWizardState = {
  step: "name" | "email" | "message";
  name: string;
  email: string;
};

type TerminalTab = {
  id: string;
  blocks: Block[];
  input: string;
  history: string[];
  /** null = editing fresh line; 0 = newest history entry, larger = older */
  historyBrowseIndex: number | null;
  contactWizard: ContactWizardState | null;
};

type TerminalState = {
  tabs: TerminalTab[];
  activeTabId: string;
};

type TerminalAction =
  | { type: "selectTab"; id: string }
  | { type: "addTab" }
  | { type: "closeTab"; id: string }
  | { type: "setInput"; id: string; value: string }
  | { type: "historyNavigate"; id: string; direction: "up" | "down" }
  | { type: "submitCommandResult"; id: string; line: string; result: CommandOutcome }
  | {
      type: "contactWizardCommit";
      id: string;
      userLine: string;
      outLines: string[];
      wizard: ContactWizardState | null;
    }
  | {
      type: "contactWizardSubmitResult";
      id: string;
      outLines: string[];
      clearWizard: boolean;
    };

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case "selectTab":
      if (!state.tabs.some((t) => t.id === action.id)) return state;
      return { ...state, activeTabId: action.id };

    case "addTab": {
      if (state.tabs.length >= MAX_TABS) return state;
      const id = crypto.randomUUID();
      const tab: TerminalTab = {
        id,
        blocks: [WELCOME],
        input: "",
        history: [],
        historyBrowseIndex: null,
        contactWizard: null,
      };
      return { activeTabId: id, tabs: [...state.tabs, tab] };
    }

    case "closeTab": {
      if (state.tabs.length <= 1) return state;
      const tabs = state.tabs.filter((t) => t.id !== action.id);
      if (tabs.length === 0) return state;
      let activeTabId = state.activeTabId;
      if (action.id === activeTabId) {
        const idx = state.tabs.findIndex((t) => t.id === action.id);
        const fallback = tabs[Math.max(0, idx - 1)] ?? tabs[0];
        activeTabId = fallback.id;
      }
      return { tabs, activeTabId };
    }

    case "setInput":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === action.id
            ? { ...t, input: action.value, historyBrowseIndex: null }
            : t
        ),
      };

    case "historyNavigate": {
      const { id, direction } = action;
      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id !== id) return t;
          if (t.contactWizard) return t;
          const { history, historyBrowseIndex } = t;
          if (history.length === 0) return t;

          if (direction === "up") {
            let nextIdx: number;
            if (historyBrowseIndex === null) {
              nextIdx = 0;
            } else if (historyBrowseIndex < history.length - 1) {
              nextIdx = historyBrowseIndex + 1;
            } else {
              return t;
            }
            const line = history[history.length - 1 - nextIdx]!;
            return { ...t, input: line, historyBrowseIndex: nextIdx };
          }

          if (historyBrowseIndex === null) return t;
          if (historyBrowseIndex === 0) {
            return { ...t, input: "", historyBrowseIndex: null };
          }
          const nextIdx = historyBrowseIndex - 1;
          const line = history[history.length - 1 - nextIdx]!;
          return { ...t, input: line, historyBrowseIndex: nextIdx };
        }),
      };
    }

    case "submitCommandResult": {
      const { id, line, result } = action;
      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id !== id) return t;
          const last = t.history[t.history.length - 1];
          const newHistory = last !== line ? [...t.history, line] : [...t.history];

          if (result.type === "clear") {
            return {
              ...t,
              input: "",
              history: newHistory,
              historyBrowseIndex: null,
              blocks: [WELCOME],
              contactWizard: null,
            };
          }
          const nextBlocks: Block[] = [...t.blocks, { type: "cmd", text: line }];
          if (result.lines.length > 0) {
            nextBlocks.push({ type: "out", lines: result.lines });
          }
          return {
            ...t,
            input: "",
            history: newHistory,
            historyBrowseIndex: null,
            blocks: nextBlocks,
            contactWizard: t.contactWizard,
          };
        }),
      };
    }

    case "contactWizardCommit": {
      const { id, userLine, outLines, wizard } = action;
      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id !== id) return t;
          const last = t.history[t.history.length - 1];
          const newHistory = last !== userLine ? [...t.history, userLine] : [...t.history];
          const nextBlocks: Block[] = [...t.blocks, { type: "cmd", text: userLine }];
          if (outLines.length > 0) {
            nextBlocks.push({ type: "out", lines: outLines });
          }
          return {
            ...t,
            input: "",
            history: newHistory,
            historyBrowseIndex: null,
            blocks: nextBlocks,
            contactWizard: wizard,
          };
        }),
      };
    }

    case "contactWizardSubmitResult": {
      const { id, outLines, clearWizard } = action;
      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id !== id) return t;
          const nextBlocks: Block[] = [...t.blocks];
          if (outLines.length > 0) {
            nextBlocks.push({ type: "out", lines: outLines });
          }
          return {
            ...t,
            blocks: nextBlocks,
            contactWizard: clearWizard ? null : t.contactWizard,
          };
        }),
      };
    }

    default:
      return state;
  }
}

function initialTerminalState(): TerminalState {
  const id = crypto.randomUUID();
  return {
    tabs: [
      {
        id,
        blocks: [WELCOME],
        input: "",
        history: [],
        historyBrowseIndex: null,
        contactWizard: null,
      },
    ],
    activeTabId: id,
  };
}

function applyTabCompletionToLine(current: string): string | null {
  const trimmed = current;
  const m = /^\s*(\S+)/.exec(trimmed);
  if (!m) return null;
  const first = m[1]!;
  const restStart = m[0].length;
  const rest = trimmed.slice(restStart);
  const completed = completeCommandPrefix(first);
  if (completed == null) return null;
  const tail = rest.trim();
  if (!tail) return completed;
  return `${completed.trimEnd()} ${tail}`;
}

export type TerminalHomeProps = {
  /** Fills a Win98 desktop window instead of the full-screen terminal view */
  embedded?: boolean;
};

export const TerminalHome: React.FC<TerminalHomeProps> = ({ embedded = false }) => {
  const { data: portfolioData, config } = usePortfolioData();
  const { trackFormSubmission } = useAchievementTracker();
  const [state, dispatch] = useReducer(terminalReducer, undefined, initialTerminalState);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusCommandInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const activeTab = state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0];
  const blocks = activeTab?.blocks ?? [WELCOME];
  const input = activeTab?.input ?? "";

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [state.activeTabId, state.tabs, blocks, input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [state.activeTabId]);

  const submit = useCallback(() => {
    const line = input.trim();
    if (!line || !activeTab) return;

    const wizard = activeTab.contactWizard;

    if (wizard) {
      const low = line.toLowerCase();
      if (low === "cancel" || low === "abort") {
        dispatch({
          type: "contactWizardCommit",
          id: activeTab.id,
          userLine: line,
          outLines: ["(message cancelled)"],
          wizard: null,
        });
        return;
      }

      if (wizard.step === "name") {
        const err = validateContactStep("name", line);
        if (err) {
          dispatch({
            type: "contactWizardCommit",
            id: activeTab.id,
            userLine: line,
            outLines: [err],
            wizard,
          });
          return;
        }
        dispatch({
          type: "contactWizardCommit",
          id: activeTab.id,
          userLine: line,
          outLines: ["", "Email (for replies):"],
          wizard: { step: "email", name: line.trim(), email: "" },
        });
        return;
      }

      if (wizard.step === "email") {
        const err = validateContactStep("email", line);
        if (err) {
          dispatch({
            type: "contactWizardCommit",
            id: activeTab.id,
            userLine: line,
            outLines: [err],
            wizard,
          });
          return;
        }
        dispatch({
          type: "contactWizardCommit",
          id: activeTab.id,
          userLine: line,
          outLines: ["", "Message (min 10 characters, one line):"],
          wizard: { step: "message", name: wizard.name, email: line.trim() },
        });
        return;
      }

      const err = validateContactStep("message", line);
      if (err) {
        dispatch({
          type: "contactWizardCommit",
          id: activeTab.id,
          userLine: line,
          outLines: [err],
          wizard,
        });
        return;
      }

      const formId = resolveFormspreeId(config.site.formspreeId);
      const payload = { name: wizard.name, email: wizard.email, message: line.trim() };
      const tabId = activeTab.id;
      const userLine = line;
      const holdWizard: ContactWizardState = { ...wizard };

      dispatch({
        type: "contactWizardCommit",
        id: tabId,
        userLine,
        outLines: ["", "Sending…"],
        wizard: holdWizard,
      });

      void (async () => {
        try {
          await submitPortfolioContact(formId, payload);
          soundManager.submit();
          trackFormSubmission();
          analytics.trackEvent("contact_form_submitted", { formId });
          dispatch({
            type: "contactWizardSubmitResult",
            id: tabId,
            outLines: ["", "Message sent."],
            clearWizard: true,
          });
        } catch (e) {
          soundManager.error();
          const msg = e instanceof Error ? e.message : "Send failed";
          dispatch({
            type: "contactWizardSubmitResult",
            id: tabId,
            outLines: ["", `Error: ${msg}`],
            clearWizard: false,
          });
        }
      })();
      return;
    }

    const parsed = parseCli(line);
    if (parsed.command === "contact" && parsed.flags.send === true) {
      dispatch({
        type: "contactWizardCommit",
        id: activeTab.id,
        userLine: line,
        outLines: [
          "",
          "Interactive message: type your name at the next prompt.",
          "(Type cancel or abort anytime to quit.)",
          "",
          "Your name:",
        ],
        wizard: { step: "name", name: "", email: "" },
      });
      return;
    }

    const result = runTerminalCommand(line, portfolioData);
    if (result.type === "output" && result.openUrl) {
      window.open(result.openUrl, "_blank", "noopener,noreferrer");
    }
    dispatch({
      type: "submitCommandResult",
      id: activeTab.id,
      line,
      result,
    });
  }, [input, activeTab, portfolioData, config.site.formspreeId, trackFormSubmission]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeTab?.contactWizard) return;
      if (activeTab) dispatch({ type: "historyNavigate", id: activeTab.id, direction: "up" });
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeTab?.contactWizard) return;
      if (activeTab) dispatch({ type: "historyNavigate", id: activeTab.id, direction: "down" });
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (activeTab?.contactWizard) return;
      const next = applyTabCompletionToLine(input);
      if (next != null && activeTab) {
        dispatch({ type: "setInput", id: activeTab.id, value: next });
      }
    }
  };

  const inputWidthCh = Math.max(input.length, 1) + INPUT_CH_PAD;

  const addTab = () => dispatch({ type: "addTab" });

  return (
    <section
      className={`${styles.container}${embedded ? ` ${styles.containerEmbedded}` : ""}`}
      aria-label="Portfolio terminal"
      role="region"
    >
      <div className={styles.terminal_toolbar}>
        <div className={styles.butt}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btn_red}`}
            aria-label="Close (decorative)"
            tabIndex={-1}
          />
          <button
            type="button"
            className={`${styles.btn} ${styles.btn_yellow}`}
            aria-label="Minimize (decorative)"
            tabIndex={-1}
          />
          <button
            type="button"
            className={`${styles.btn} ${styles.btn_green}`}
            aria-label="Maximize (decorative)"
            tabIndex={-1}
          />
        </div>

        <div className={styles.tabList} role="tablist" aria-label="Terminal tabs">
          {state.tabs.map((tab, tabIndex) => (
            <div
              key={tab.id}
              className={`${styles.tabCell} ${tab.id === state.activeTabId ? styles.tabCellActive : ""}`}
            >
              <button
                type="button"
                role="tab"
                id={`terminal-tab-${tab.id}`}
                aria-selected={tab.id === state.activeTabId}
                aria-controls="terminal-tabpanel"
                aria-label={`${TAB_LABEL}, tab ${tabIndex + 1} of ${state.tabs.length}`}
                className={`${styles.tab} ${tab.id === state.activeTabId ? styles.tabActive : ""}`}
                onClick={() => dispatch({ type: "selectTab", id: tab.id })}
              >
                {TAB_LABEL}
              </button>
              {state.tabs.length > 1 && (
                <button
                  type="button"
                  className={styles.tabClose}
                  aria-label={`Close tab ${tabIndex + 1}`}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    dispatch({ type: "closeTab", id: tab.id });
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.newTabBtn}
          aria-label="New tab"
          title={state.tabs.length >= MAX_TABS ? `Maximum ${MAX_TABS} tabs` : "New tab"}
          disabled={state.tabs.length >= MAX_TABS}
          onClick={addTab}
        >
          +
        </button>
      </div>

      <div className={styles.terminal_body} onClick={focusCommandInput}>
        <div
          ref={transcriptRef}
          id="terminal-tabpanel"
          className={styles.transcriptScroll}
          role="tabpanel"
          aria-labelledby={activeTab ? `terminal-tab-${activeTab.id}` : undefined}
          aria-live="polite"
          aria-relevant="additions"
        >
          {blocks.map((b, i) => {
            if (b.type === "welcome" || b.type === "out") {
              return (
                <React.Fragment key={i}>
                  {b.lines.map((line, j) => (
                    <p key={`${i}-${j}`} className={styles.line}>
                      {line}
                    </p>
                  ))}
                </React.Fragment>
              );
            }
            if (b.type === "cmd") {
              return (
                <p key={i} className={styles.cmdLine}>
                  <span className={styles.terminal_user}>ranne@portfolio:</span>
                  <span className={styles.terminal_location}>~</span>
                  <span className={styles.terminal_bling}>$</span> {b.text}
                </p>
              );
            }
            return null;
          })}

          <div className={styles.promptRow}>
            <span className={styles.terminal_user}>ranne@portfolio:</span>
            <span className={styles.terminal_location}>~</span>
            <span className={styles.terminal_bling}>$</span>
            <input
              ref={inputRef}
              className={styles.commandInput}
              type="text"
              value={input}
              onChange={(e) =>
                activeTab &&
                dispatch({
                  type: "setInput",
                  id: activeTab.id,
                  value: e.target.value,
                })
              }
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoFocus
              aria-label="Terminal command input"
              style={{ width: `${inputWidthCh}ch` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
