import { contentfulClient } from "./contentful";
import type { ContactPageEntry, ContactPageSkeleton } from "../types/contentful";

export async function getContactPage(): Promise<ContactPageEntry | null> {
  const res = await contentfulClient.getEntries<ContactPageSkeleton>({
    content_type: "contactPage",
    limit: 1,
  });

  return res.items[0] ?? null;
}
