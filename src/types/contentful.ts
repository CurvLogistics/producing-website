import type { Entry, EntryFieldTypes, EntrySkeletonType } from "contentful";

export interface HomePageFields {
  heroVideo?: EntryFieldTypes.AssetLink;
  content: EntryFieldTypes.RichText;
}

export interface HomePageSkeleton extends EntrySkeletonType {
  contentTypeId: "homePage";
  fields: HomePageFields;
}

export type HomePageEntry = Entry<HomePageSkeleton, undefined>;
