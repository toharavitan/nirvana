import type { MetadataRoute } from "next";

import { site, villas } from "@/content/site";

/** All indexable routes, for /sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}`, priority: 1 },
    { url: `${base}/villas`, priority: 0.9 },
    { url: `${base}/experiences`, priority: 0.8 },
    { url: `${base}/reservation`, priority: 0.9 },
    { url: `${base}/terms`, priority: 0.4 },
    { url: `${base}/privacy`, priority: 0.4 },
    { url: `${base}/accessibility`, priority: 0.4 },
  ].map((p) => ({ ...p, lastModified: now, changeFrequency: "monthly" }));

  const villaPages: MetadataRoute.Sitemap = villas.map((v) => ({
    url: `${base}/villas/${v.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...villaPages];
}
