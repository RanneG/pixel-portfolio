import React from "react";
import { TerminalHome } from "../../terminal/TerminalHome";

export const TerminalWindowContent: React.FC = () => {
  return (
    <div className="win98-terminal-embed">
      <TerminalHome embedded />
    </div>
  );
};
