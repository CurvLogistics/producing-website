import type { Entry, EntryFieldTypes, EntrySkeletonType } from "contentful";

export interface FeatureCardFields {
  icon: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  body: EntryFieldTypes.Text;
  linkHref?: EntryFieldTypes.Symbol;
  linkLabel?: EntryFieldTypes.Symbol;
}

export interface FeatureCardSkeleton extends EntrySkeletonType {
  contentTypeId: "featureCard";
  fields: FeatureCardFields;
}

export type FeatureCardEntry = Entry<FeatureCardSkeleton, undefined>;

export interface HomePageFields {
  heroVideo?: EntryFieldTypes.AssetLink;
  content: EntryFieldTypes.RichText;
  whatWeDoEyebrow?: EntryFieldTypes.Symbol;
  whatWeDoHeading?: EntryFieldTypes.Symbol;
  whatWeDoIntro?: EntryFieldTypes.Symbol;
  whatWeDoCards?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FeatureCardSkeleton>>;
}

export interface HomePageSkeleton extends EntrySkeletonType {
  contentTypeId: "homePage";
  fields: HomePageFields;
}

export type HomePageEntry = Entry<HomePageSkeleton, undefined>;