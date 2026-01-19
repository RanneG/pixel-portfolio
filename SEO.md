# SEO & Analytics Guide

Complete guide for SEO optimization and analytics setup for the 8-bit portfolio.

## 🔍 SEO Optimizations

### Meta Tags

The portfolio includes comprehensive meta tags in `index.html`:

- **Basic SEO**: Title, description, keywords, author
- **Open Graph**: For Facebook, LinkedIn sharing
- **Twitter Cards**: For Twitter sharing
- **Robots**: Search engine directives
- **Canonical URL**: Prevents duplicate content

### Structured Data (JSON-LD)

Automatically generated structured data includes:

- **Person schema** - Your profile information
- **CreativeWork schema** - Your projects
- **Social profiles** - Links to social media
- **Contact information** - Email and location

### Sitemap

Located at `/sitemap.xml`:

- Lists all main sections
- Includes priority and change frequency
- Update `lastmod` dates when content changes
- Update domain URLs before deployment

### Robots.txt

Located at `/robots.txt`:

- Allows all search engines
- Points to sitemap location
- Blocks admin panel in production
- Adjust crawl-delay if needed

## 📊 Analytics Setup

### Plausible Analytics (Recommended)

**Why Plausible?**
- Privacy-friendly (no cookies, GDPR compliant)
- Lightweight (~1KB script)
- Respects Do Not Track
- Simple, clean dashboard

**Setup Steps:**

1. **Sign up** at [plausible.io](https://plausible.io)
2. **Add your domain** in Plausible dashboard
3. **Set environment variables:**
   ```env
   VITE_ANALYTICS_PROVIDER=plausible
   VITE_PLAUSIBLE_DOMAIN=yourdomain.com
   ```
4. **Deploy** - Analytics will start tracking automatically

**Dashboard:** Access at [plausible.io](https://plausible.io) with your account

### Google Analytics 4

**Setup Steps:**

1. **Create GA4 property** at [analytics.google.com](https://analytics.google.com)
2. **Get Measurement ID** (format: G-XXXXXXXXXX)
3. **Set environment variables:**
   ```env
   VITE_ANALYTICS_PROVIDER=ga4
   VITE_GA4_ID=G-XXXXXXXXXX
   ```
4. **Deploy** - Analytics will start tracking

**Privacy Settings:**
- IP anonymization enabled
- Respects Do Not Track
- GDPR compliant configuration

## 📈 Tracked Events

### Automatic Events

These events are tracked automatically:

| Event | Description | Properties |
|-------|-------------|------------|
| `section_viewed` | User navigates to a section | `section` |
| `contact_form_submitted` | Form submission | `formId` |
| `konami_code_activated` | Konami code entered | - |
| `theme_change` | Theme switched | `theme` |
| `project_click` | Project link clicked | `project`, `type` (github/live) |
| `share` | Content shared | `method`, `title` |
| `Web Vital` | Performance metric | `metric`, `value`, `rating` |

### Custom Event Tracking

Add custom events in your components:

```tsx
import { analytics } from "../utils/analytics";

// Track custom event
analytics.trackEvent("custom_event", {
  property1: "value1",
  property2: "value2"
});
```

## 🎯 Core Web Vitals

### Tracked Metrics

- **LCP (Largest Contentful Paint)** - Loading performance
- **FID (First Input Delay)** - Interactivity
- **CLS (Cumulative Layout Shift)** - Visual stability
- **FCP (First Contentful Paint)** - Initial render

### Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| FID | ≤ 100ms | ≤ 300ms | > 300ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| FCP | ≤ 1.8s | ≤ 3.0s | > 3.0s |

### Privacy

- Respects Do Not Track header
- Stores metrics locally (last 100)
- Sends to analytics only if tracking allowed
- No personal data collected

## 🔗 Social Sharing

### Share Button Component

The `ShareButton` component provides:

- **Native Web Share API** (mobile/desktop)
- **Copy link** fallback
- **Analytics tracking** of shares
- **Sound effects** integration

### Usage

```tsx
import { ShareButton } from "./components/ShareButton";

<ShareButton
  title="Project Name"
  text="Check out this project"
  url="https://project-url.com"
  projectTitle="Project Name"
/>
```

### Social Preview Images

Create an Open Graph image (`og-image.png`):

- **Recommended size**: 1200×630px
- **Format**: PNG or JPG
- **Location**: `/public/og-image.png`
- **Update**: In `index.html` meta tags

## 🚀 Deployment Checklist

Before deploying, update:

- [ ] **Domain URLs** in `sitemap.xml`
- [ ] **Domain URLs** in `robots.txt`
- [ ] **Open Graph URLs** in `index.html`
- [ ] **Twitter handle** in `index.html`
- [ ] **Canonical URL** in `index.html`
- [ ] **OG image** at `/public/og-image.png`
- [ ] **Environment variables** in Vercel dashboard
- [ ] **Structured data** URLs in `src/App.tsx`

## 📱 Testing SEO

### Tools

- **Google Search Console** - Submit sitemap, check indexing
- **Google Rich Results Test** - Validate structured data
- **Facebook Sharing Debugger** - Test Open Graph
- **Twitter Card Validator** - Test Twitter Cards
- **Lighthouse** - SEO audit

### Checklist

- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Structured data validates
- [ ] Open Graph preview works
- [ ] Twitter Card preview works
- [ ] Analytics tracking works
- [ ] Web Vitals reporting

## 🔒 Privacy & Compliance

### Do Not Track

Analytics automatically respects DNT:

```typescript
if (navigator.doNotTrack === "1") {
  // Tracking disabled
}
```

### GDPR Compliance

- ✅ No cookies used (Plausible)
- ✅ IP anonymization (GA4)
- ✅ No personal data collection
- ✅ User can opt-out via browser settings
- ✅ Clear privacy policy recommended

### Opt-Out

Users can disable analytics:

```javascript
localStorage.setItem("portfolio-analytics-disabled", "true");
```

## 📊 Performance Monitoring

### Real User Monitoring

Web Vitals are tracked and stored:

- **Local storage** - Last 100 metrics
- **Analytics** - Sent to Plausible/GA4
- **Console** - Logged in development

### Performance Alerts

Set up alerts in your analytics dashboard:

- **Plausible**: Custom alerts for traffic spikes
- **GA4**: Custom alerts for performance metrics
- **Vercel**: Built-in performance monitoring

## 🎨 Social Preview Image

Create `public/og-image.png`:

**Design Tips:**
- Use portfolio branding
- Include your name/title
- 8-bit retro aesthetic
- High contrast for readability
- 1200×630px recommended

**Tools:**
- Figma/Canva for design
- Screenshot tools for quick previews
- Image optimization tools

---

**Last Updated:** 2024
**Status:** ✅ Production Ready

