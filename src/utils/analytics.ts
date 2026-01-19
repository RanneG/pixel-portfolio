/**
 * Privacy-focused analytics integration
 * Supports Plausible and Google Analytics 4
 */

interface AnalyticsConfig {
  provider: "plausible" | "ga4" | "none";
  plausibleDomain?: string;
  ga4Id?: string;
}

class Analytics {
  private config: AnalyticsConfig = {
    provider: "none"
  };
  private initialized = false;

  init(config: AnalyticsConfig) {
    if (this.initialized) return;
    this.config = config;

    if (config.provider === "plausible" && config.plausibleDomain) {
      this.initPlausible(config.plausibleDomain);
    } else if (config.provider === "ga4" && config.ga4Id) {
      this.initGA4(config.ga4Id);
    }

    this.initialized = true;
  }

  private initPlausible(domain: string) {
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = domain;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }

  private initGA4(measurementId: string) {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        anonymize_ip: true,
        respect_dnt: true
      });
    `;
    document.head.appendChild(script2);
  }

  trackEvent(eventName: string, props?: Record<string, any>) {
    if (this.config.provider === "none") return;

    if (this.config.provider === "plausible") {
      // Plausible uses custom events
      if (window.plausible) {
        (window as any).plausible(eventName, { props });
      }
    } else if (this.config.provider === "ga4") {
      if (window.gtag) {
        (window as any).gtag("event", eventName, props);
      }
    }
  }

  trackPageView(path: string) {
    if (this.config.provider === "none") return;

    if (this.config.provider === "plausible") {
      // Plausible tracks pageviews automatically
      return;
    } else if (this.config.provider === "ga4") {
      if (window.gtag) {
        (window as any).gtag("config", this.config.ga4Id, {
          page_path: path
        });
      }
    }
  }
}

export const analytics = new Analytics();

// Initialize analytics if enabled
if (import.meta.env.VITE_ANALYTICS_PROVIDER) {
  analytics.init({
    provider: import.meta.env.VITE_ANALYTICS_PROVIDER as "plausible" | "ga4",
    plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
    ga4Id: import.meta.env.VITE_GA4_ID
  });
}

