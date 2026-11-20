import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { menu, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...menu.map((item) => item.href),
    ...projects.map((project) => `/projects/${project.slug}`),
  ];
  return paths.map((path) => ({ url: `${site.url}${path}` }));
}
