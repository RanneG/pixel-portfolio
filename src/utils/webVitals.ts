/**
 * Core Web Vitals tracking
 * Respects Do Not Track and privacy preferences
 */

interface WebVitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

type WebVitalCallback = (metric: WebVitalMetric) => void;

/**
 * Check if tracking is allowed
 */
function isTrackingAllowed(): boolean {
  // Respect Do Not Track
  if (navigator.doNotTrack === "1") {
    return false;
  }

  // Check for privacy preference
  if (localStorage.getItem("portfolio-analytics-disabled") === "true") {
    return false;
  }

  return true;
}

/**
 * Get rating for metric value
 */
function getRating(name: string, value: number): "good" | "needs-improvement" | "poor" {
  const thresholds: Record<string, { good: number; poor: number }> = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 }
  };

  const threshold = thresholds[name];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

/**
 * Report Web Vital metric
 */
function reportMetric(metric: WebVitalMetric) {
  if (!isTrackingAllowed()) return;

  // Send to analytics if available
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible("Web Vital", {
      props: {
        metric: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating
      }
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vital] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta
    });
  }

  // Store in localStorage for monitoring
  try {
    const stored = JSON.parse(localStorage.getItem("web-vitals") || "[]");
    stored.push({
      ...metric,
      timestamp: Date.now()
    });
    // Keep only last 100 metrics
    const recent = stored.slice(-100);
    localStorage.setItem("web-vitals", JSON.stringify(recent));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Track Largest Contentful Paint (LCP)
 */
export function trackLCP(onPerfEntry?: WebVitalCallback) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;

      const metric: WebVitalMetric = {
        name: "LCP",
        value: lastEntry.renderTime || lastEntry.loadTime,
        rating: getRating("LCP", lastEntry.renderTime || lastEntry.loadTime),
        delta: lastEntry.renderTime || lastEntry.loadTime,
        id: lastEntry.id
      };

      reportMetric(metric);
      onPerfEntry?.(metric);
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch {
    // PerformanceObserver not supported
  }
}

/**
 * Track First Input Delay (FID)
 */
export function trackFID(onPerfEntry?: WebVitalCallback) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const metric: WebVitalMetric = {
          name: "FID",
          value: entry.processingStart - entry.startTime,
          rating: getRating("FID", entry.processingStart - entry.startTime),
          delta: entry.processingStart - entry.startTime,
          id: entry.name
        };

        reportMetric(metric);
        onPerfEntry?.(metric);
      });
    });

    observer.observe({ entryTypes: ["first-input"] });
  } catch {
    // PerformanceObserver not supported
  }
}

/**
 * Track Cumulative Layout Shift (CLS)
 */
export function trackCLS(onPerfEntry?: WebVitalCallback) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  let clsValue = 0;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      const metric: WebVitalMetric = {
        name: "CLS",
        value: clsValue,
        rating: getRating("CLS", clsValue),
        delta: clsValue,
        id: "cls"
      };

      reportMetric(metric);
      onPerfEntry?.(metric);
    });

    observer.observe({ entryTypes: ["layout-shift"] });
  } catch {
    // PerformanceObserver not supported
  }
}

/**
 * Track First Contentful Paint (FCP)
 */
export function trackFCP(onPerfEntry?: WebVitalCallback) {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === "first-contentful-paint") {
          const metric: WebVitalMetric = {
            name: "FCP",
            value: entry.startTime,
            rating: getRating("FCP", entry.startTime),
            delta: entry.startTime,
            id: entry.name
          };

          reportMetric(metric);
          onPerfEntry?.(metric);
        }
      });
    });

    observer.observe({ entryTypes: ["paint"] });
  } catch {
    // PerformanceObserver not supported
  }
}

/**
 * Initialize all Web Vitals tracking
 */
export function initWebVitals() {
  if (!isTrackingAllowed()) return;

  trackLCP();
  trackFID();
  trackCLS();
  trackFCP();
}

