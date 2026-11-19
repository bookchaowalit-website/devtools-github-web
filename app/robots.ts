import type { MetadataRoute } from "next";
import { SITE } from "@/components/shelf-views";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: SITE + "/sitemap.xml" };
}
