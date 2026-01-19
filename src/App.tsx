import React, { Suspense, lazy } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import CharacterStats from "./components/CharacterStats";
import SavePoint from "./components/SavePoint";
import Footer from "./components/Footer";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import { PortfolioDataProvider, usePortfolioData } from "./contexts/PortfolioDataContext";
import { AchievementsProvider } from "./contexts/AchievementsContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { KonamiCode } from "./components/KonamiCode";
import { SkipToContent } from "./components/SkipToContent";
import { InstallPrompt } from "./components/InstallPrompt";
import { AchievementManager } from "./components/AchievementManager";
import { QuestLogSkeleton, SkillInventorySkeleton } from "./components/LoadingSkeleton";
import AdminPanel from "./components/AdminPanel";
import { initWebVitals } from "./utils/webVitals";
import { updateMetaTags, generateStructuredData, injectStructuredData } from "./utils/seo";
import { analytics } from "./utils/analytics";

// Lazy load heavy components for code splitting with prefetching
const SettingsPanel = lazy(() => import("./components/SettingsPanel"));
const SkillInventory = lazy(() => import("./components/SkillInventory"));
const QuestLog = lazy(() => import("./components/QuestLog"));

const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const { data, config } = usePortfolioData();

  // Initialize SEO and Web Vitals
  React.useEffect(() => {
    // Update meta tags
    const siteUrl = window.location.origin;
    updateMetaTags({
      title: config?.site?.title || `${data.name} | 8-Bit Portfolio`,
      description: config?.site?.description || data.title,
      url: siteUrl,
      image: `${siteUrl}/og-image.png`, // Update with actual image path
      siteName: config?.site?.title || "8-Bit Portfolio",
      type: "website"
    });

    // Inject structured data
    const structuredData = generateStructuredData({
      name: data.name,
      title: data.title,
      description: data.bio.join(" "),
      url: siteUrl,
      email: data.contact.email,
      socialLinks: data.socialLinks,
      projects: data.projects.map((p) => ({
        title: p.title,
        description: p.description,
        url: p.liveUrl || p.githubUrl
      }))
    });
    injectStructuredData(structuredData);

    // Initialize Web Vitals tracking
    initWebVitals();
  }, [data, config]);

  // Track theme changes
  React.useEffect(() => {
    if (settings.theme) {
      analytics.trackEvent("theme_change", { theme: settings.theme });
    }
  }, [settings.theme]);
  
  return (
    <>
      <SkipToContent />
      <KonamiCode />
      <InstallPrompt />
      <AchievementManager />
      {import.meta.env.DEV && <AdminPanel />}
      <Suspense fallback={null}>
        <SettingsPanel />
      </Suspense>
      <div className={`min-h-screen bg-bg text-foreground crt-flicker ${settings.scanlinesEnabled ? "scanlines" : ""}`}>
        <Navigation name={data.name} />
        <main id="main-content">
          <Hero name={data.name} subtitle={data.subtitle} stats={data.stats} />
          <CharacterStats
            name={`${data.name} / DEV`}
            title={data.title}
            bio={data.bio}
            statusBadges={data.statusBadges}
            attributes={data.attributes}
            experience={data.experience}
          />
          <Suspense fallback={<SkillInventorySkeleton />}>
            <SkillInventory skills={data.skills} />
          </Suspense>
          <Suspense fallback={<QuestLogSkeleton />}>
            <QuestLog projects={data.projects} />
          </Suspense>
          <SavePoint
            contactInfo={data.contact}
            socialLinks={data.socialLinks}
            availableForHire={data.availableForHire}
            formspreeId={import.meta.env.VITE_FORMSPREE_ID || config?.site?.formspreeId || "xeeegyek"}
          />
        </main>
        <Footer name={data.name} />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <AchievementsProvider>
          <PortfolioDataProvider>
            <AppContent />
          </PortfolioDataProvider>
        </AchievementsProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
};

export default App;
