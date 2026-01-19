import React, { useState, useEffect } from "react";
import { usePortfolioData } from "../contexts/PortfolioDataContext";
import type { PortfolioData, PersonalData, StatsData, SkillsData, ProjectsData } from "../types";

const AdminPanel: React.FC = () => {
  const { data, reload, isLoading, config } = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "stats" | "skills" | "projects">("personal");
  const [localData, setLocalData] = useState<Partial<PortfolioData>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("portfolio-preview-data");
    if (saved) {
      try {
        setLocalData(JSON.parse(saved));
        setHasChanges(true);
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const handleChange = (section: keyof PortfolioData, field: string, value: any) => {
    const updated = {
      ...localData,
      [section]: {
        ...(localData[section] as any),
        [field]: value
      }
    };
    setLocalData(updated);
    setHasChanges(true);
    localStorage.setItem("portfolio-preview-data", JSON.stringify(updated));
  };

  const handleArrayChange = (section: keyof PortfolioData, field: string, index: number, value: string) => {
    const current = (localData[section] as any)?.[field] || (data[section] as any)[field];
    const updated = [...current];
    updated[index] = value;
    handleChange(section, field, updated);
  };

  const handleExport = () => {
    const exportData = {
      personal: {
        name: localData.name ?? data.name,
        title: localData.title ?? data.title,
        subtitle: localData.subtitle ?? data.subtitle,
        bio: localData.bio ?? data.bio,
        statusBadges: localData.statusBadges ?? data.statusBadges,
        contact: localData.contact ?? data.contact,
        socialLinks: localData.socialLinks ?? data.socialLinks,
        availableForHire: localData.availableForHire ?? data.availableForHire
      },
      stats: {
        projects: localData.stats?.projects ?? data.stats.projects,
        level: localData.stats?.level ?? data.stats.level,
        creativity: localData.stats?.creativity ?? data.stats.creativity,
        attributes: localData.attributes ?? data.attributes,
        experience: localData.experience ?? data.experience
      },
      skills: {
        categories: localData.skills ?? data.skills,
        specialAbilities: [] // Add if needed
      },
      projects: {
        projects: localData.projects ?? data.projects
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    localStorage.removeItem("portfolio-preview-data");
    setLocalData({});
    setHasChanges(false);
    reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 pixel-border bg-card p-3 text-primary hover:bg-card/80 transition-transform hover:scale-110 md:hidden"
        aria-label="Open admin panel"
      >
        <span className="font-pixel text-xs">⚙</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-bg/95 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
    >
      <div className="pixel-border bg-card p-4 md:p-6 box-glow w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 id="admin-title" className="font-pixel text-sm text-primary">
            ADMIN PANEL
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-primary hover:text-secondary font-pixel text-xs"
            aria-label="Close admin panel"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-muted font-pixel">LOADING...</p>
        ) : (
          <>
            <div className="flex gap-2 mb-4 text-xs font-pixel border-b border-muted pb-2">
              {(["personal", "stats", "skills", "projects"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 pixel-border ${
                    activeTab === tab ? "bg-primary text-bg" : "bg-bg text-foreground"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-3 text-xs">
              {activeTab === "personal" && (
                <>
                  <div>
                    <label className="font-pixel text-[10px] text-muted block mb-1">NAME</label>
                    <input
                      type="text"
                      value={localData.name ?? data.name}
                      onChange={(e) => handleChange("name", "name", e.target.value)}
                      className="w-full border border-muted bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-pixel text-[10px] text-muted block mb-1">TITLE</label>
                    <input
                      type="text"
                      value={localData.title ?? data.title}
                      onChange={(e) => handleChange("title", "title", e.target.value)}
                      className="w-full border border-muted bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-pixel text-[10px] text-muted block mb-1">SUBTITLE</label>
                    <input
                      type="text"
                      value={localData.subtitle ?? data.subtitle}
                      onChange={(e) => handleChange("subtitle", "subtitle", e.target.value)}
                      className="w-full border border-muted bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-pixel text-[10px] text-muted block mb-1">BIO (one per line)</label>
                    <textarea
                      value={(localData.bio ?? data.bio).join("\n")}
                      onChange={(e) =>
                        handleChange("bio", "bio", e.target.value.split("\n").filter((l) => l.trim()))
                      }
                      rows={4}
                      className="w-full border border-muted bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </>
              )}

              {activeTab === "stats" && (
                <>
                  <div>
                    <label className="font-pixel text-[10px] text-muted block mb-1">PROJECTS COUNT</label>
                    <input
                      type="number"
                      value={localData.stats?.projects ?? data.stats.projects}
                      onChange={(e) =>
                        handleChange("stats", "projects", parseInt(e.target.value) || 0)
                      }
                      className="w-full border border-muted bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-pixel text-[10px] text-muted block mb-1">LEVEL</label>
                    <input
                      type="text"
                      value={localData.stats?.level ?? data.stats.level}
                      onChange={(e) => handleChange("stats", "level", e.target.value)}
                      className="w-full border border-muted bg-bg px-2 py-1 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </>
              )}

              {activeTab === "projects" && (
                <div className="space-y-2">
                  <p className="font-pixel text-[10px] text-muted">
                    Edit projects in data/projects.json for permanent changes
                  </p>
                  <p className="text-foreground/70 text-[10px]">
                    Current projects: {(localData.projects ?? data.projects).length}
                  </p>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-2">
                  <p className="font-pixel text-[10px] text-muted">
                    Edit skills in data/skills.json for permanent changes
                  </p>
                  <p className="text-foreground/70 text-[10px]">
                    Current categories: {(localData.skills ?? data.skills).length}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2 flex-wrap">
              <button
                onClick={handleExport}
                className="retro-btn retro-btn-primary px-3 py-2 font-pixel text-[9px] uppercase min-h-[44px]"
              >
                EXPORT JSON
              </button>
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="retro-btn bg-muted text-foreground px-3 py-2 font-pixel text-[9px] uppercase min-h-[44px]"
                >
                  RESET
                </button>
              )}
              <p className="text-[9px] text-muted self-center">
                Changes saved to localStorage for preview
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

