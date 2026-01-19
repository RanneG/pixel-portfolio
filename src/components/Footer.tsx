import React from "react";

interface FooterProps {
  name?: string;
}

const Footer: React.FC<FooterProps> = ({ name = "PLAYER ONE" }) => {
  return (
    <footer className="border-t border-muted bg-bg py-6 text-center text-[10px] md:text-[11px]" role="contentinfo">
      <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-2">
        <div className="flex flex-col items-center justify-between gap-2 text-xs md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-primary neon-glow">
              {"<DEV/>"}
            </span>
            <span>Crafted with ❤️ and ☕</span>
          </div>
          <span className="text-muted">
            © {new Date().getFullYear()} {name}. ALL RIGHTS RESERVED.
          </span>
        </div>
        <p className="konami-hint font-pixel text-[8px] md:text-[9px] text-secondary neon-glow-secondary" aria-label="Easter egg hint" />
      </div>
    </footer>
  );
};

export default Footer;

