/**
 * SEO utilities for meta tags and structured data
 */

export interface SEOData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  twitterHandle?: string;
}

/**
 * Update meta tags for SEO
 */
export function updateMetaTags(data: SEOData) {
  const { title, description, image, url, type = "website", siteName, twitterHandle } = data;

  // Basic meta tags
  updateMetaTag("title", title);
  updateMetaTag("description", description);

  // Open Graph tags
  updateMetaTag("og:title", title, "property");
  updateMetaTag("og:description", description, "property");
  updateMetaTag("og:type", type, "property");
  if (url) updateMetaTag("og:url", url, "property");
  if (image) updateMetaTag("og:image", image, "property");
  if (siteName) updateMetaTag("og:site_name", siteName, "property");

  // Twitter Card tags
  updateMetaTag("twitter:card", "summary_large_image");
  updateMetaTag("twitter:title", title);
  updateMetaTag("twitter:description", description);
  if (image) updateMetaTag("twitter:image", image);
  if (twitterHandle) updateMetaTag("twitter:creator", twitterHandle);
}

function updateMetaTag(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
}

/**
 * Generate JSON-LD structured data for portfolio
 */
export function generateStructuredData(data: {
  name: string;
  title: string;
  description: string;
  url: string;
  email?: string;
  socialLinks?: Array<{ name: string; url: string }>;
  projects?: Array<{ title: string; description: string; url?: string }>;
}) {
  const { name, title, description, url, email, socialLinks, projects } = data;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: title,
    description,
    url,
    ...(email && { email }),
    ...(socialLinks && {
      sameAs: socialLinks.map((link) => link.url)
    }),
    ...(projects && {
      knowsAbout: projects.map((project) => ({
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        ...(project.url && { url: project.url })
      }))
    })
  };

  return structuredData;
}

/**
 * Inject structured data into page
 */
export function injectStructuredData(data: object) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

