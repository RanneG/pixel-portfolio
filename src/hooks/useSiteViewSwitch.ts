import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings, type SiteView } from "../contexts/SettingsContext";

export function useSiteViewSwitch() {
  const { settings, updateSetting } = useSettings();
  const navigate = useNavigate();

  const switchTo = useCallback(
    (view: SiteView) => {
      if (settings.siteView === view) return;
      updateSetting("siteView", view);
      if (view === "terminal" || view === "desktop") {
        navigate("/", { replace: true });
      } else {
        navigate("/");
      }
    },
    [navigate, settings.siteView, updateSetting]
  );

  return { siteView: settings.siteView, switchTo };
}
