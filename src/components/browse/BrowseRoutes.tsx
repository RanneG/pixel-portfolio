import React from "react";
import { Route, Routes } from "react-router-dom";
import { BrowseLayout } from "./BrowseLayout";
import { BrowseHome } from "./pages/BrowseHome";
import { BrowseAbout } from "./pages/BrowseAbout";
import { BrowseExperience } from "./pages/BrowseExperience";
import { BrowseEducation } from "./pages/BrowseEducation";
import { BrowseSkills } from "./pages/BrowseSkills";
import { BrowseProjects } from "./pages/BrowseProjects";
import { BrowseContact } from "./pages/BrowseContact";

export const BrowseRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<BrowseLayout />}>
      <Route index element={<BrowseHome />} />
      <Route path="about" element={<BrowseAbout />} />
      <Route path="experience" element={<BrowseExperience />} />
      <Route path="education" element={<BrowseEducation />} />
      <Route path="skills" element={<BrowseSkills />} />
      <Route path="projects" element={<BrowseProjects />} />
      <Route path="contact" element={<BrowseContact />} />
    </Route>
  </Routes>
);
