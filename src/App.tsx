import React, { Suspense, lazy, useEffect, useRef } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import { PortfolioDataProvider, usePortfolioData } from "./contexts/PortfolioDataContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AchievementsProvider } from "./contexts/AchievementsContext";
import { AchievementManager } from "./components/AchievementManager";
import { SkipToContent } from "./components/SkipToContent";
import { InstallPrompt } from "./components/InstallPrompt";
import AdminPanel from "./components/AdminPanel";
import { MatrixBackground } from "./components/terminal/MatrixBackground";
import { TerminalHome } from "./components/terminal/TerminalHome";
import { BrowseRoutes } from "./components/browse/BrowseRoutes";
import { PortfolioLoader, PORTFOLIO_LOADER_HOLD_MS } from "./components/PortfolioLoader";
import { initWebVitals } from "./utils/webVitals";
import { updateMetaTags, generateStructuredData, injectStructuredData } from "./utils/seo";
import { analytics } from "./utils/analytics";

const SettingsPanel = lazy(() => import("./components/SettingsPanel"));

const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const { data, config, isLoading } = usePortfolioData();
  const navigate = useNavigate();
  const location = useLocation();
  const prevSiteView = useRef(settings.siteView);
  const loaderPrevSiteView = useRef(settings.siteView);
  const [browseShellPending, setBrowseShellPending] = React.useState(false);

  useEffect(() => {
    const siteUrl = window.location.origin;
    updateMetaTags({
      title: config?.site?.title || `${data.name} | 8-Bit Portfolio`,
      description: config?.site?.description || data.title,
      url: siteUrl,
      image: `${siteUrl}/og-image.png`,
      siteName: config?.site?.title || "8-Bit Portfolio",
      type: "website",
    });

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
        url: p.liveUrl || p.githubUrl,
      })),
    });
    injectStructuredData(structuredData);

    initWebVitals();
  }, [data, config]);

  useEffect(() => {
    if (prevSiteView.current !== settings.siteView) {
      analytics.trackEvent("site_view_change", { siteView: settings.siteView });
      prevSiteView.current = settings.siteView;
    }
  }, [settings.siteView]);

  useEffect(() => {
    if (isLoading) return;
    const prev = loaderPrevSiteView.current;
    loaderPrevSiteView.current = settings.siteView;
    if (prev === "terminal" && settings.siteView === "browse") {
      setBrowseShellPending(true);
      const id = window.setTimeout(() => setBrowseShellPending(false), PORTFOLIO_LOADER_HOLD_MS);
      return () => window.clearTimeout(id);
    }
    if (prev === "browse" && settings.siteView === "terminal") {
      setBrowseShellPending(true);
      const id = window.setTimeout(() => setBrowseShellPending(false), PORTFOLIO_LOADER_HOLD_MS);
      return () => window.clearTimeout(id);
    }
  }, [isLoading, settings.siteView]);

  useEffect(() => {
    if (isLoading) return;
    if (settings.siteView === "terminal" && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [isLoading, settings.siteView, location.pathname, navigate]);

  return (
    <>
      <SkipToContent />
      <InstallPrompt />
      {import.meta.env.DEV && <AdminPanel />}
      <Suspense fallback={null}>
        <SettingsPanel />
      </Suspense>
      {isLoading ? (
        <div
          id="main-content"
          className="min-h-screen bg-black flex items-center justify-center font-pixel text-xs text-muted"
          aria-busy="true"
        >
          LOADING…
        </div>
      ) : settings.siteView === "browse" ? (
        <>
          {browseShellPending && (
            <PortfolioLoader variant={settings.siteView === "browse" ? "browse" : "dark"} />
          )}
          <BrowseRoutes />
        </>
      ) : (
        <>
          {browseShellPending && (
            <PortfolioLoader variant={settings.siteView === "browse" ? "browse" : "dark"} />
          )}
          <div className="relative min-h-screen h-full bg-black text-foreground">
            <MatrixBackground />
            <main
              id="main-content"
              className="relative z-10 flex min-h-screen items-center justify-center p-4"
            >
              <TerminalHome />
            </main>
          </div>
        </>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AchievementsProvider>
          <SettingsProvider>
            <PortfolioDataProvider>
              <AchievementManager />
              <AppContent />
            </PortfolioDataProvider>
          </SettingsProvider>
        </AchievementsProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
