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

export interface SegmentCardFields {
  icon: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  body: EntryFieldTypes.Text;
  buttonLabel: EntryFieldTypes.Symbol;
  buttonHref: EntryFieldTypes.Symbol;
  highlight?: EntryFieldTypes.Boolean;
}

export interface SegmentCardSkeleton extends EntrySkeletonType {
  contentTypeId: "segmentCard";
  fields: SegmentCardFields;
}

export type SegmentCardEntry = Entry<SegmentCardSkeleton, undefined>;

export interface ProductTileFields {
  label: EntryFieldTypes.Symbol;
  image?: EntryFieldTypes.AssetLink;
  href?: EntryFieldTypes.Symbol;
}

export interface ProductTileSkeleton extends EntrySkeletonType {
  contentTypeId: "productTile";
  fields: ProductTileFields;
}

export type ProductTileEntry = Entry<ProductTileSkeleton, undefined>;

export interface EventCardFields {
  number: EntryFieldTypes.Symbol;
  name: EntryFieldTypes.Symbol;
  note: EntryFieldTypes.Symbol;
  image?: EntryFieldTypes.AssetLink;
  href?: EntryFieldTypes.Symbol;
}

export interface EventCardSkeleton extends EntrySkeletonType {
  contentTypeId: "eventCard";
  fields: EventCardFields;
}

export type EventCardEntry = Entry<EventCardSkeleton, undefined>;

export interface CarouselSlideFields {
  media: EntryFieldTypes.AssetLink;
  heading?: EntryFieldTypes.Symbol;
  body?: EntryFieldTypes.Symbol;
}

export interface CarouselSlideSkeleton extends EntrySkeletonType {
  contentTypeId: "carouselSlide";
  fields: CarouselSlideFields;
}

export type CarouselSlideEntry = Entry<CarouselSlideSkeleton, undefined>;

export interface HomePageFields {
  heroVideo?: EntryFieldTypes.AssetLink;
  content: EntryFieldTypes.RichText;

  carouselSlides?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<CarouselSlideSkeleton>>;

  whatWeDoEyebrow?: EntryFieldTypes.Symbol;
  whatWeDoHeading?: EntryFieldTypes.Symbol;
  whatWeDoIntro?: EntryFieldTypes.Symbol;
  whatWeDoCards?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FeatureCardSkeleton>>;

  whyChooseEyebrow?: EntryFieldTypes.Symbol;
  whyChooseHeading?: EntryFieldTypes.Symbol;
  whyChooseIntro?: EntryFieldTypes.Symbol;
  whyChooseCards?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FeatureCardSkeleton>>;

  twoWaysEyebrow?: EntryFieldTypes.Symbol;
  twoWaysHeading?: EntryFieldTypes.Symbol;
  twoWaysCards?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SegmentCardSkeleton>>;

  productsEyebrow?: EntryFieldTypes.Symbol;
  productsHeading?: EntryFieldTypes.Symbol;
  productsCtaLabel?: EntryFieldTypes.Symbol;
  productsCtaHref?: EntryFieldTypes.Symbol;
  productsTiles?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ProductTileSkeleton>>;

  storyEyebrow?: EntryFieldTypes.Symbol;
  storyHeading?: EntryFieldTypes.Symbol;
  storyBody?: EntryFieldTypes.Text;
  storyImage?: EntryFieldTypes.AssetLink;
  storyVideo?: EntryFieldTypes.AssetLink;
  storyLinkLabel?: EntryFieldTypes.Symbol;
  storyLinkHref?: EntryFieldTypes.Symbol;

  eventsEyebrow?: EntryFieldTypes.Symbol;
  eventsHeading?: EntryFieldTypes.Symbol;
  eventsIntro?: EntryFieldTypes.Symbol;
  eventsCards?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EventCardSkeleton>>;
  eventsCtaLabel?: EntryFieldTypes.Symbol;
  eventsCtaHref?: EntryFieldTypes.Symbol;

  testimonialQuote?: EntryFieldTypes.Text;
  testimonialAttribution?: EntryFieldTypes.Symbol;
}

export interface HomePageSkeleton extends EntrySkeletonType {
  contentTypeId: "homePage";
  fields: HomePageFields;
}

export type HomePageEntry = Entry<HomePageSkeleton, undefined>;

export interface ContactPageFields {
  eyebrow?: EntryFieldTypes.Symbol;
  heading?: EntryFieldTypes.Symbol;
  intro?: EntryFieldTypes.Symbol;
  consentText?: EntryFieldTypes.Symbol;
  submitLabel?: EntryFieldTypes.Symbol;
  successMessage?: EntryFieldTypes.Symbol;
  errorMessage?: EntryFieldTypes.Symbol;

  socialLabel?: EntryFieldTypes.Symbol;
  socialHref?: EntryFieldTypes.Symbol;
  gallery?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
}

export interface ContactPageSkeleton extends EntrySkeletonType {
  contentTypeId: "contactPage";
  fields: ContactPageFields;
}

export type ContactPageEntry = Entry<ContactPageSkeleton, undefined>;

export interface UpcomingEventFields {
  image: EntryFieldTypes.AssetLink;
  name?: EntryFieldTypes.Symbol;
  dateTime?: EntryFieldTypes.Date;
  description?: EntryFieldTypes.Text;
  href?: EntryFieldTypes.Symbol;
}

export interface UpcomingEventSkeleton extends EntrySkeletonType {
  contentTypeId: "upcomingEvent";
  fields: UpcomingEventFields;
}

export type UpcomingEventEntry = Entry<UpcomingEventSkeleton, undefined>;

export interface EventGalleryGroupFields {
  name: EntryFieldTypes.Symbol;
  note: EntryFieldTypes.Symbol;
  images?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
}

export interface EventGalleryGroupSkeleton extends EntrySkeletonType {
  contentTypeId: "eventGalleryGroup";
  fields: EventGalleryGroupFields;
}

export type EventGalleryGroupEntry = Entry<EventGalleryGroupSkeleton, undefined>;

export interface EventsPageFields {
  heroEyebrow?: EntryFieldTypes.Symbol;
  heroHeading?: EntryFieldTypes.Symbol;
  heroIntro?: EntryFieldTypes.Symbol;
  heroImage?: EntryFieldTypes.AssetLink;

  upcomingEyebrow?: EntryFieldTypes.Symbol;
  upcomingHeading?: EntryFieldTypes.Symbol;
  upcomingEvents?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<UpcomingEventSkeleton>>;

  highlightsEyebrow?: EntryFieldTypes.Symbol;
  highlightsHeading?: EntryFieldTypes.Symbol;
  galleryGroups?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EventGalleryGroupSkeleton>>;

  ctaHeading?: EntryFieldTypes.Symbol;
  ctaIntro?: EntryFieldTypes.Symbol;
  ctaLabel?: EntryFieldTypes.Symbol;
  ctaHref?: EntryFieldTypes.Symbol;
}

export interface EventsPageSkeleton extends EntrySkeletonType {
  contentTypeId: "eventsPage";
  fields: EventsPageFields;
}

export type EventsPageEntry = Entry<EventsPageSkeleton, undefined>;

export interface TeamMemberFields {
  name: EntryFieldTypes.Symbol;
  role?: EntryFieldTypes.Symbol;
  image?: EntryFieldTypes.AssetLink;
  href?: EntryFieldTypes.Symbol;
}

export interface TeamMemberSkeleton extends EntrySkeletonType {
  contentTypeId: "teamMember";
  fields: TeamMemberFields;
}

export type TeamMemberEntry = Entry<TeamMemberSkeleton, undefined>;

export interface AboutPageFields {
  heroEyebrow?: EntryFieldTypes.Symbol;
  heroHeading?: EntryFieldTypes.Symbol;
  heroIntro?: EntryFieldTypes.Symbol;
  heroImage?: EntryFieldTypes.AssetLink;

  storyHeading?: EntryFieldTypes.Symbol;
  storyBody?: EntryFieldTypes.Text;
  storyImage?: EntryFieldTypes.AssetLink;

  stat1Value?: EntryFieldTypes.Number;
  stat1Label?: EntryFieldTypes.Symbol;
  stat2Value?: EntryFieldTypes.Number;
  stat2Label?: EntryFieldTypes.Symbol;
  stat3Value?: EntryFieldTypes.Number;
  stat3Label?: EntryFieldTypes.Symbol;
  stat4Value?: EntryFieldTypes.Number;
  stat4Label?: EntryFieldTypes.Symbol;
  statsNote?: EntryFieldTypes.Symbol;

  valuesEyebrow?: EntryFieldTypes.Symbol;
  valuesHeading?: EntryFieldTypes.Symbol;
  valuesCards?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FeatureCardSkeleton>>;

  newsEyebrow?: EntryFieldTypes.Symbol;
  newsHeading?: EntryFieldTypes.Symbol;
  newsCards?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FeatureCardSkeleton>>;

  teamEyebrow?: EntryFieldTypes.Symbol;
  teamHeading?: EntryFieldTypes.Symbol;
  ourTeam?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TeamMemberSkeleton>>;
}

export interface AboutPageSkeleton extends EntrySkeletonType {
  contentTypeId: "aboutPage";
  fields: AboutPageFields;
}

export type AboutPageEntry = Entry<AboutPageSkeleton, undefined>;
