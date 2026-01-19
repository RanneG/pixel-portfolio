import React, { useState } from "react";
import { soundManager } from "../utils/soundManager";
import { analytics } from "../utils/analytics";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  projectTitle?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text,
  url = window.location.href,
  projectTitle
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    soundManager.click();

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || `Check out ${title}`,
          url
        });
        analytics.trackEvent("share", {
          method: "native",
          title: projectTitle || title
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      soundManager.submit();
      analytics.trackEvent("share", {
        method: "copy",
        title: projectTitle || title
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="retro-btn retro-btn-primary px-3 py-1.5 md:py-1 font-pixel text-[9px] md:text-[10px] min-h-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        aria-label={`Share ${title}`}
      >
        {navigator.share ? "SHARE" : copied ? "COPIED!" : "COPY LINK"}
      </button>
      {copied && (
        <span className="text-[9px] text-accent font-pixel" role="status" aria-live="polite">
          LINK COPIED!
        </span>
      )}
    </div>
  );
};

