import React, { useState, FormEvent } from "react";
import { soundManager } from "../utils/soundManager";
import { useAchievementTracker } from "../hooks/useAchievementTracker";
import { analytics } from "../utils/analytics";
import { useLanguage } from "../contexts/LanguageContext";
import {
  resolveFormspreeId,
  submitPortfolioContact,
  validateContactFields
} from "../utils/formspreeSubmit";

interface SavePointProps {
  contactInfo?: {
    email: string;
    location: string;
    timezone: string;
  };
  socialLinks?: Array<{ name: string; url: string }>;
  availableForHire?: boolean;
  formspreeId?: string;
  /** Browse brutalist layout (vibe template); default keeps retro terminal styling */
  variant?: "retro" | "brutalist";
}

const SavePoint: React.FC<SavePointProps> = ({
  contactInfo = {
    email: "player.one@example.dev",
    location: "NEAR A TERMINAL, SOMEWHERE ONLINE",
    timezone: "UTC+08 (MOSTLY AWAKE AT NIGHT)"
  },
  socialLinks = [
    { name: "GITHUB", url: "https://github.com" },
    { name: "LINKEDIN", url: "https://linkedin.com" },
    { name: "TWITTER", url: "https://twitter.com" }
  ],
  availableForHire = true,
  formspreeId,
  variant = "retro"
}) => {
  const formId = resolveFormspreeId(formspreeId);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { trackFormSubmission } = useAchievementTracker();

  const validateForm = () => {
    const newErrors = validateContactFields(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("loading");
    setErrors({});

    try {
      await submitPortfolioContact(formId, formData);

      setStatus("success");
      soundManager.submit();
      trackFormSubmission();
      analytics.trackEvent("contact_form_submitted", { formId });
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
      soundManager.error();
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (variant === "brutalist") {
    return (
      <section aria-labelledby="vibe-contact-heading">
        <div className="contact">
          <div className="contact-info">
            <h2 id="vibe-contact-heading">{t("browse.vibe.contactTitle")}</h2>
            <p className="vibe-lead-big">{t("browse.vibe.contactLead")}</p>
            <p>
              <strong>{t("browse.vibe.contactEmailLabel")}:</strong>{" "}
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </p>
            <p>
              <strong>{t("browse.vibe.contactLocationLabel")}:</strong> {contactInfo.location}
            </p>
            <p style={{ marginTop: "12px", fontSize: "0.9rem" }}>
              <strong>TIMEZONE:</strong> {contactInfo.timezone}
            </p>
            <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.name}
                </a>
              ))}
            </div>
            {availableForHire ? (
              <div style={{ marginTop: "28px" }}>
                <p style={{ fontWeight: 700, color: "var(--secondary)" }}>
                  {t("browse.vibe.availabilityTitle")}
                </p>
                <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "var(--muted)", maxWidth: "36rem" }}>
                  {t("browse.vibe.availabilitySub")}
                </p>
              </div>
            ) : null}
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="vibe-sp-name">{t("browse.vibe.contactFormName")}</label>
                <input
                  id="vibe-sp-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-required="true"
                />
                {errors.name ? (
                  <p style={{ color: "#ff6b6b", marginTop: "8px", fontSize: "0.85rem" }} role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className="input-group">
                <label htmlFor="vibe-sp-email">{t("browse.vibe.contactFormEmail")}</label>
                <input
                  id="vibe-sp-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-required="true"
                />
                {errors.email ? (
                  <p style={{ color: "#ff6b6b", marginTop: "8px", fontSize: "0.85rem" }} role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div className="input-group">
                <label htmlFor="vibe-sp-message">{t("browse.vibe.contactFormMessage")}</label>
                <textarea
                  id="vibe-sp-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-required="true"
                />
                {errors.message ? (
                  <p style={{ color: "#ff6b6b", marginTop: "8px", fontSize: "0.85rem" }} role="alert">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <button type="submit" disabled={status === "loading"} aria-busy={status === "loading"}>
                {status === "loading" ? "…" : t("browse.vibe.contactFormSubmit")}
              </button>
              {status === "success" ? (
                <p style={{ marginTop: "16px", color: "var(--secondary)" }} role="status">
                  Message sent.
                </p>
              ) : null}
              {status === "error" ? (
                <p style={{ marginTop: "16px", color: "#ff6b6b" }} role="alert">
                  Could not send. Try again.
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="bg-[radial-gradient(circle_at_bottom,_hsl(320_100%_12%)_0,_hsl(240_10%_4%)_55%)] py-12 md:py-16 lg:py-24 border-t border-muted"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 id="contact-heading" className="mb-6 font-pixel text-xs md:text-sm text-secondary neon-glow-secondary">
          &gt; CONTACT
        </h2>
        <p className="sr-only">Contact form and social media links</p>

        <div className="grid gap-6 md:gap-8 md:grid-cols-[minmax(0,_3fr)_minmax(0,_2fr)]">
          <div className="pixel-border bg-card p-4 md:p-6 box-glow">
            <p className="mb-3 font-pixel text-[10px] md:text-xs text-muted">NEW MESSAGE</p>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs" noValidate>
              <div className="space-y-1">
                <label className="font-pixel text-[9px] md:text-[10px]" htmlFor="name">
                  NAME <span className="text-secondary" aria-label="required">*</span>
                </label>
                <span id="name-desc" className="sr-only">
                  Required field
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.name ? "border-secondary" : "border-muted"
                  } bg-bg px-3 py-3 md:px-2 md:py-1 text-sm md:text-xs outline-none focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 min-h-[48px] md:min-h-[44px]`}
                  placeholder="Your name…"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error name-desc" : "name-desc"}
                  aria-required="true"
                />
                {errors.name && (
                  <p id="name-error" className="text-xs md:text-[9px] text-secondary font-pixel mt-1" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="font-pixel text-[9px] md:text-[10px]" htmlFor="email">
                  EMAIL <span className="text-secondary" aria-label="required">*</span>
                </label>
                <span id="email-desc" className="sr-only">
                  Required field
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.email ? "border-secondary" : "border-muted"
                  } bg-bg px-3 py-3 md:px-2 md:py-1 text-sm md:text-xs outline-none focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 min-h-[48px] md:min-h-[44px]`}
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error email-desc" : "email-desc"}
                  aria-required="true"
                />
                {errors.email && (
                  <p id="email-error" className="text-xs md:text-[9px] text-secondary font-pixel mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="font-pixel text-[9px] md:text-[10px]" htmlFor="message">
                  MESSAGE <span className="text-secondary" aria-label="required">*</span>
                </label>
                <span id="message-desc" className="sr-only">
                  Required field
                </span>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.message ? "border-secondary" : "border-muted"
                  } bg-bg px-3 py-3 md:px-2 md:py-1 text-sm md:text-xs outline-none focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 resize-y min-h-[120px]`}
                  placeholder="Your message (min 10 characters)…"
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error message-desc" : "message-desc"}
                  aria-required="true"
                />
                {errors.message && (
                  <p id="message-error" className="text-xs md:text-[9px] text-secondary font-pixel mt-1" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="retro-btn retro-btn-primary mt-2 px-4 py-3 md:py-2 font-pixel text-sm md:text-[10px] uppercase tracking-widest min-h-[48px] md:min-h-[44px] w-full disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                aria-label={status === "loading" ? "Submitting form, please wait" : "Submit contact form"}
                aria-busy={status === "loading"}
              >
                {status === "loading" ? "SENDING…" : "SEND MESSAGE"}
              </button>

              {status === "success" && (
                <p className="mt-2 text-[9px] md:text-[10px] text-accent font-pixel" role="status">
                  ★ Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 text-[9px] md:text-[10px] text-secondary font-pixel" role="alert">
                  ✗ ERROR: Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>

          <div className="space-y-4">
            <div className="pixel-border bg-card p-4 md:p-6 box-glow">
              <p className="font-pixel text-[10px] md:text-xs text-muted mb-2">CONTACT DATA</p>
              <div className="space-y-2 text-[10px] md:text-xs">
                <p>
                  &gt; EMAIL:{" "}
                  <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                    {contactInfo.email}
                  </a>
                </p>
                <p>&gt; LOCATION: {contactInfo.location}</p>
                <p>&gt; TIMEZONE: {contactInfo.timezone}</p>
              </div>
            </div>
            <div className="pixel-border bg-card p-4 md:p-6 box-glow">
              <p className="font-pixel text-[10px] md:text-xs text-muted mb-2">
                SOCIAL LINKS
              </p>
              <div className="flex flex-wrap gap-2 text-[9px] md:text-[10px] font-pixel">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-border bg-bg px-3 py-2 md:py-1 transition-transform hover:-translate-y-0.5 min-h-[44px] flex items-center justify-center"
                    aria-label={`Visit ${social.name} profile`}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
            {availableForHire && (
              <div className="pixel-border bg-card p-4 md:p-6 box-glow flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] md:text-[11px]">
                  <span className="h-2 w-2 animate-pulse bg-accent" aria-hidden="true" />
                  <span className="font-pixel text-accent">
                    {t("browse.vibe.availabilityTitle")}
                  </span>
                </div>
                <p className="text-[9px] md:text-[10px] text-muted font-retro leading-relaxed">
                  {t("browse.vibe.availabilitySub")}
                </p>
                <span className="text-[9px] md:text-[10px] text-muted font-pixel">
                  {t("browse.vibe.availabilityStatus")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavePoint;
