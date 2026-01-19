import React, { useState, FormEvent } from "react";

interface SavePointProps {
  contactInfo?: {
    email: string;
    location: string;
    timezone: string;
  };
  socialLinks?: Array<{ name: string; url: string }>;
  availableForHire?: boolean;
  formspreeId?: string; // Formspree form ID
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
    { name: "TWITTER", url: "https://twitter.com" },
    { name: "DRIBBBLE", url: "https://dribbble.com" }
  ],
  availableForHire = true,
  formspreeId = "xeeegyek" // Default to your Formspree ID
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
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
      // Use Formspree if ID is provided
      if (formspreeId) {
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: `New message from ${formData.name}`
          })
        });

        if (response.ok) {
          setStatus("success");
          setFormData({ name: "", email: "", message: "" });
          // Reset success message after 5 seconds
          setTimeout(() => setStatus("idle"), 5000);
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Form submission failed");
        }
      } else {
        throw new Error("Formspree ID is required");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <section
      id="save-point"
      className="bg-[radial-gradient(circle_at_bottom,_hsl(320_100%_12%)_0,_hsl(240_10%_4%)_55%)] py-12 md:py-16 lg:py-24 border-t border-muted"
      aria-labelledby="save-point-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 id="save-point-heading" className="mb-6 font-pixel text-xs md:text-sm text-secondary neon-glow-secondary">
          &gt; SAVE POINT
        </h2>

        <div className="grid gap-6 md:gap-8 md:grid-cols-[minmax(0,_3fr)_minmax(0,_2fr)]">
          <div className="pixel-border bg-card p-4 md:p-6 box-glow">
            <p className="mb-3 font-pixel text-[10px] md:text-xs text-muted">NEW MESSAGE</p>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs" noValidate>
              <div className="space-y-1">
                <label className="font-pixel text-[9px] md:text-[10px]" htmlFor="name">
                  PLAYER NAME
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.name ? "border-secondary" : "border-muted"
                  } bg-bg px-3 py-3 md:px-2 md:py-1 text-sm md:text-xs outline-none focus:border-primary min-h-[48px] md:min-h-[44px]`}
                  placeholder="ENTER NAME..."
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-xs md:text-[9px] text-secondary font-pixel mt-1" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="font-pixel text-[9px] md:text-[10px]" htmlFor="email">
                  SAVE SLOT (EMAIL)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.email ? "border-secondary" : "border-muted"
                  } bg-bg px-3 py-3 md:px-2 md:py-1 text-sm md:text-xs outline-none focus:border-primary min-h-[48px] md:min-h-[44px]`}
                  placeholder="ENTER EMAIL..."
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs md:text-[9px] text-secondary font-pixel mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="font-pixel text-[9px] md:text-[10px]" htmlFor="message">
                  MESSAGE DATA
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.message ? "border-secondary" : "border-muted"
                  } bg-bg px-3 py-3 md:px-2 md:py-1 text-sm md:text-xs outline-none focus:border-primary resize-y min-h-[120px]`}
                  placeholder="DESCRIBE YOUR QUEST..."
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
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
                className="retro-btn retro-btn-primary mt-2 px-4 py-3 md:py-2 font-pixel text-sm md:text-[10px] uppercase tracking-widest min-h-[48px] md:min-h-[44px] w-full disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Submit contact form"
              >
                {status === "loading" ? "SAVING..." : "SAVE GAME"}
              </button>
              
              {status === "success" && (
                <p className="mt-2 text-[9px] md:text-[10px] text-accent font-pixel" role="status">
                  ★ SAVED! ★ Message sent successfully!
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
              <div className="pixel-border bg-card p-4 md:p-6 box-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[10px] md:text-[11px]">
                  <span className="h-2 w-2 animate-pulse bg-accent" aria-hidden="true" />
                  <span className="font-pixel text-accent">
                    AVAILABLE FOR HIRE
                  </span>
                </div>
                <span className="text-[9px] md:text-[10px] text-muted font-pixel">
                  STATUS: LOOKING FOR NEXT QUEST
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

