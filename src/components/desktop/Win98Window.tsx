import React from "react";

type Props = {
  title: string;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  statusText?: string;
  style?: React.CSSProperties;
  flushContent?: boolean;
  children: React.ReactNode;
};

export const Win98Window: React.FC<Props> = ({
  title,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  statusText,
  style,
  flushContent = false,
  children
}) => {
  return (
    <div
      className={`win98-window ${isActive ? "win98-window-active" : "win98-window-inactive"}`}
      style={style}
      onMouseDown={onFocus}
      role="dialog"
      aria-label={title}
    >
      <div className="win98-titlebar">
        <span className="win98-titlebar-text">{title}</span>
        <div className="win98-titlebar-controls">
          <button
            type="button"
            className="win98-titlebar-btn"
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            _
          </button>
          <button type="button" className="win98-titlebar-btn" aria-label="Maximize" disabled>
            □
          </button>
          <button
            type="button"
            className="win98-titlebar-btn"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div className="win98-menubar" aria-hidden>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Help</span>
      </div>
      <div className="win98-window-body">
        <div
          className={
            flushContent ? "win98-window-body-inner win98-window-body-flush" : "win98-window-body-inner"
          }
        >
          {children}
        </div>
      </div>
      {statusText ? (
        <div className="win98-statusbar">
          <div className="win98-statusbar-panel">{statusText}</div>
        </div>
      ) : null}
    </div>
  );
};
