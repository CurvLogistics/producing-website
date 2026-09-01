import { contentfulClient } from "./contentful";
import type { EventsPageEntry, EventsPageSkeleton } from "../types/contentful";

export async function getEventsPage(): Promise<EventsPageEntry | null> {
  const res = await contentfulClient.getEntries<EventsPageSkeleton>({
    content_type: "eventsPage",
    limit: 1,
  });

  return res.items[0] ?? null;
}
