/**
 * Formspree contact form — shared by SavePoint (browse/retro) and terminal `contact --send`.
 */

export function resolveFormspreeId(explicit?: string): string {
  const fromConfig = explicit?.trim();
  if (fromConfig) return fromConfig;
  const fromEnv = (import.meta.env.VITE_FORMSPREE_ID as string | undefined)?.trim();
  if (fromEnv) return fromEnv;
  return "xeeegyek";
}

export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

/** Field-keyed errors; empty object means valid. */
export function validateContactFields(fields: ContactFields): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (!name) {
    errors.name = "Name is required";
  }
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email format";
  }
  if (!message) {
    errors.message = "Message is required";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  return errors;
}

/** Single-line validation for terminal wizard steps. */
export function validateContactStep(
  step: "name" | "email" | "message",
  value: string
): string | undefined {
  const v = value.trim();
  if (step === "name") {
    if (!v) return "Name is required";
    return undefined;
  }
  if (step === "email") {
    if (!v) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email format";
    return undefined;
  }
  if (!v) return "Message is required";
  if (v.length < 10) return "Message must be at least 10 characters";
  return undefined;
}

export async function submitPortfolioContact(
  formId: string,
  fields: ContactFields
): Promise<void> {
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  const body = new URLSearchParams();
  body.set("name", name);
  body.set("email", email);
  body.set("message", message);
  body.set("_replyto", email);
  body.set("_subject", `Portfolio: message from ${name}`);

  const response = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });

  const payload = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    errors?: Record<string, string | string[]>;
  };

  if (!response.ok) {
    const fieldErrors = payload.errors
      ? Object.values(payload.errors)
          .flat()
          .filter(Boolean)
          .join("; ")
      : "";
    throw new Error(
      (typeof payload.error === "string" && payload.error) ||
        fieldErrors ||
        `Form submission failed (${response.status})`
    );
  }
  if (payload && "ok" in payload && payload.ok === false) {
    throw new Error(typeof payload.error === "string" ? payload.error : "Form submission rejected");
  }
}
