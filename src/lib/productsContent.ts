import { contentfulClient } from "./contentful";
import type { ProductsPageEntry, ProductsPageSkeleton } from "../types/contentful";

export async function getProductsPage(): Promise<ProductsPageEntry | null> {
  const res = await contentfulClient.getEntries<ProductsPageSkeleton>({
    content_type: "productsPage",
    limit: 1,
  });

  return res.items[0] ?? null;
}
