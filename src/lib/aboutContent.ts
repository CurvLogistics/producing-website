import { contentfulClient } from "./contentful";
import type { AboutPageEntry, AboutPageSkeleton } from "../types/contentful";

export async function getAboutPage(): Promise<AboutPageEntry | null> {
  const res = await contentfulClient.getEntries<AboutPageSkeleton>({
    content_type: "aboutPage",
    limit: 1,
  });

  return res.items[0] ?? null;
}
