import React, { Suspense, lazy } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import CharacterStats from "./components/CharacterStats";
import SavePoint from "./components/SavePoint";
import Footer from "./components/Footer";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import { PortfolioDataProvider, usePortfolioData } from "./contexts/PortfolioDataContext";
import { KonamiCode } from "./components/KonamiCode";
import { SkipToContent } from "./components/SkipToContent";
import { InstallPrompt } from "./components/InstallPrompt";
import { QuestLogSkeleton, SkillInventorySkeleton } from "./components/LoadingSkeleton";

// Lazy load heavy components for code splitting with prefetching
const SettingsPanel = lazy(() => import("./components/SettingsPanel"));
const SkillInventory = lazy(() => import("./components/SkillInventory"));
const QuestLog = lazy(() => import("./components/QuestLog"));

const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const { data } = usePortfolioData();
  
  return (
    <>
      <SkipToContent />
      <KonamiCode />
      <InstallPrompt />
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
            formspreeId={import.meta.env.VITE_FORMSPREE_ID || "xeeegyek"}
          />
        </main>
        <Footer name={data.name} />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <PortfolioDataProvider>
        <AppContent />
      </PortfolioDataProvider>
    </SettingsProvider>
  );
};

export default App;
