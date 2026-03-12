import type { MetadataRoute } from "next";

const BASE_URL = "https://ihsanwealth.onrender.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/guide", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/assistant", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/duas", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/calendar", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/prayer-times", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/quran", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/qibla", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/sadaqah", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/history", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/auth/login", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/auth/register", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/site-map", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/usage-rights", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
