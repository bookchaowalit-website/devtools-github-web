import type { MetadataRoute } from "next";
import { SITE } from "@/components/shelf-views";
import { seedRepositories } from "@/lib/github-shelf";

export default function sitemap(): MetadataRoute.Sitemap {
  return [SITE + "/", ...seedRepositories.map((r) => SITE + "/repos/" + r.id)].map((url) => ({ url }));
}
