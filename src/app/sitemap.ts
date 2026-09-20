import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/** All indexable routes, for /sitemap.xml. Shrunk site: five pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  return [
    { url: `${base}`, priority: 1 },
    { url: `${base}/villas`, priority: 0.9 },
    { url: `${base}/experiences`, priority: 0.8 },
    { url: `${base}/faq`, priority: 0.6 },
    { url: `${base}/accessibility`, priority: 0.4 },
  ].map((p) => ({ ...p, lastModified: now, changeFrequency: "monthly" }));
}
