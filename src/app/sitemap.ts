import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, changeFrequency: "weekly", priority: 1 }];
}
