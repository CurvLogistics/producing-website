import { contentfulClient } from "./contentful";
import type { HomePageEntry, HomePageSkeleton } from "../types/contentful";

export async function getHomePage(): Promise<HomePageEntry | null> {
  const res = await contentfulClient.getEntries<HomePageSkeleton>({
    content_type: "homePage",
    limit: 1,
  });

  return res.items[0] ?? null;
}
