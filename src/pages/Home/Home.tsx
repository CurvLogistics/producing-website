import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomePage } from "../../lib/homeContent";
import type {
  HomePageEntry,
  FeatureCardFields,
  SegmentCardFields,
  ProductTileFields,
  EventCardFields,
  CarouselSlideFields,
} from "../../types/contentful";
import FeatureGrid, { type FeatureGridItem } from "../../components/FeatureGrid/FeatureGrid";
// import ContentSection from "../../components/ContentSection/ContentSection";
import SegmentSplit, { type SegmentSplitItem } from "../../components/SegmentSplit/SegmentSplit";
import ImageTileGrid, { type ImageTileGridItem } from "../../components/ImageTileGrid/ImageTileGrid";
import ImageText from "../../components/ImageText/ImageText";
import EventsRail, { type EventsRailItem } from "../../components/EventsRail/EventsRail";
import NewsletterBar from "../../components/NewsletterBar/NewsletterBar";
import Testimonial from "../../components/Testimonial/Testimonial";
import Carousel, { type CarouselSlideData } from "../../components/Carousel/Carousel";
import Reveal from "../../components/Reveal/Reveal";
import "./Home.css";

const NOW_SOURCING = ["🟢 Limes", "🍊 Citrus", "🥑 Avocados", "🍇 Table Grapes", "🍅 Tomatoes", "🥭 Mangoes", "🍍 Pineapple", "🥦 Vegetables"];

export default function Home() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<HomePageEntry | null>(null);

  useEffect(() => {
    let cancelled = false;

    getHomePage()
      .then((result) => {
        if (cancelled) return;
        setEntry(result);
      })
      .catch((err) => {
        console.error("Failed to load homePage entry from Contentful", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const heading = "Your Trusted Partner in Fresh Produce";
  const intro =
    "Looking for a trusted wholesale partner? We connect growers, distributors, and markets with fresh produce and reliable service, every day.";
  const heroPoster = "/hero-bg.jpg";

  const heroVideoField = entry?.fields.heroVideo;
  const heroVideoAsset = heroVideoField && "fields" in heroVideoField ? heroVideoField : undefined;
  const heroVideoUrl = heroVideoAsset?.fields.file?.url;
  const heroVideoSrc = heroVideoUrl ? `https:${heroVideoUrl}` : "/hero-bg.mp4";

  const whatWeDoItems: FeatureGridItem[] = (entry?.fields.whatWeDoCards ?? [])
    .filter((card): card is typeof card & { fields: FeatureCardFields } => !!card && "fields" in card)
    .map((card) => ({
      icon: card.fields.icon as string,
      title: card.fields.title as string,
      body: card.fields.body as string,
      linkHref: card.fields.linkHref as string | undefined,
      linkLabel: card.fields.linkLabel as string | undefined,
    }));

   const whyChooseItems: FeatureGridItem[] = (entry?.fields.whyChooseCards ?? [])
  .filter((card): card is typeof card & { fields: FeatureCardFields } => !!card && "fields" in card)
  .map((card) => ({
    icon: card.fields.icon as string,
    title: card.fields.title as string,
    body: card.fields.body as string,
    linkHref: card.fields.linkHref as string | undefined,
    linkLabel: card.fields.linkLabel as string | undefined,
  }));

  const twoWaysItems: SegmentSplitItem[] = (entry?.fields.twoWaysCards ?? [])
  .filter((card): card is typeof card & { fields: SegmentCardFields } => !!card && "fields" in card)
  .map((card) => ({
    icon: card.fields.icon as string,
    title: card.fields.title as string,
    body: card.fields.body as string,
    buttonLabel: card.fields.buttonLabel as string,
    buttonHref: card.fields.buttonHref as string,
    highlight: card.fields.highlight as boolean | undefined,
  }));

  const productTiles: ImageTileGridItem[] = (entry?.fields.productsTiles ?? [])
    .filter((tile): tile is typeof tile & { fields: ProductTileFields } => !!tile && "fields" in tile)
    .map((tile) => {
      const imageField = tile.fields.image;
      const imageAsset = imageField && "fields" in imageField ? imageField : undefined;
      const imageUrl = imageAsset?.fields.file?.url;
      return {
        label: tile.fields.label as string,
        imageUrl: imageUrl ? `https:${imageUrl}` : undefined,
        href: tile.fields.href as string | undefined,
      };
    });

  const storyImageField = entry?.fields.storyImage;
  const storyImageAsset = storyImageField && "fields" in storyImageField ? storyImageField : undefined;
  const storyImageUrl = storyImageAsset?.fields.file?.url;
  const storyImageAlt = storyImageAsset?.fields.title ?? entry?.fields.storyHeading;

  const storyVideoField = entry?.fields.storyVideo;
  const storyVideoAsset = storyVideoField && "fields" in storyVideoField ? storyVideoField : undefined;
  const storyVideoUrl = storyVideoAsset?.fields.file?.url;

  const carouselSlides: CarouselSlideData[] = (entry?.fields.carouselSlides ?? [])
    .filter((slide): slide is typeof slide & { fields: CarouselSlideFields } => !!slide && "fields" in slide)
    .map((slide) => {
      const asset = slide.fields.media && "fields" in slide.fields.media ? slide.fields.media : undefined;
      const contentType = asset?.fields.file?.contentType ?? "";
      const url = asset?.fields.file?.url;
      return {
        mediaUrl: url ? `https:${url}` : "",
        mediaType: contentType.startsWith("video/") ? ("video" as const) : ("image" as const),
        heading: slide.fields.heading as string | undefined,
        body: slide.fields.body as string | undefined,
      };
    })
    .filter((slide) => slide.mediaUrl);

  const eventItems: EventsRailItem[] = (entry?.fields.eventsCards ?? [])
    .filter((card): card is typeof card & { fields: EventCardFields } => !!card && "fields" in card)
    .map((card) => {
      const imageField = card.fields.image;
      const imageAsset = imageField && "fields" in imageField ? imageField : undefined;
      const imageUrl = imageAsset?.fields.file?.url;
      return {
        number: card.fields.number as string,
        name: card.fields.name as string,
        note: card.fields.note as string,
        href: card.fields.href as string | undefined,
        imageUrl: imageUrl ? `https:${imageUrl}` : undefined,
      };
    });

  return (
    <>
      <section className="home-hero">
        <video
          key={heroVideoSrc}
          className="home-hero__bg"
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>
        <div className="home-hero__overlay" />

        <svg className="home-hero__shape" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <path
            className="home-hero__shape-path"
            d="M60 300c0-60 60-90 100-50s-10 110-60 90-60-90 10-140 150-10 130 60-90 90-140 40"
            stroke="var(--amber-500)"
            strokeWidth="14"
            strokeLinecap="round"
          />
        </svg>

        <div className="home-hero__inner">
          <h1 className="home-hero__reveal" style={{ animationDelay: "0.15s" }}>
            {heading}
          </h1>

          <div className="home-hero__intro home-hero__reveal" style={{ animationDelay: "0.25s" }}>
            {intro}
          </div>

          <div className="home-hero__ctas home-hero__reveal" style={{ animationDelay: "0.35s" }}>
            <button className="btn btn-outline" onClick={() => navigate("/contact")}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Reveal direction="up">
        <section className="home-trust">
          <div className="home-trust__inner">
            <span>Trusted &amp; Experienced</span>
            <span>Reliable Availability</span>
            <span>Quality Guaranteed</span>
            <span>Relationship-Driven Service</span>
          </div>
        </section>
      </Reveal>

      <div className="home-ticker">
        <div className="home-ticker__inner">
          <span className="home-ticker__label">Now Sourcing</span>
          <div className="home-ticker__viewport">
            <div className="home-ticker__track">
              {[...NOW_SOURCING, ...NOW_SOURCING].map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <ContentSection
        status={status}
        hasEntry={!!entry}
        content={entry?.fields.content}
        fallbackAlt={heading}
      /> */}

      {whatWeDoItems.length > 0 && (
        <Reveal direction="up">
          <FeatureGrid
            eyebrow={entry?.fields.whatWeDoEyebrow || "What We Do"}
            heading={entry?.fields.whatWeDoHeading || "One partner for sourcing, moving, and delivering produce"}
            intro={entry?.fields.whatWeDoIntro}
            items={whatWeDoItems}
          />
        </Reveal>
      )}
      {whyChooseItems.length > 0 && (
        <Reveal direction="up">
          <FeatureGrid
            alt
            eyebrow={entry?.fields.whyChooseEyebrow || "Why Choose Producing"}
            heading={
              entry?.fields.whyChooseHeading ||
              "Customers stay because we're reliable partners, not just a supplier"
            }
            intro={entry?.fields.whyChooseIntro}
            items={whyChooseItems}
          />
        </Reveal>
      )}
      {twoWaysItems.length > 0 && (
        <Reveal direction="up">
          <SegmentSplit
            eyebrow={entry?.fields.twoWaysEyebrow || "Two Ways to Work With Us"}
            heading={
              entry?.fields.twoWaysHeading || "Whether You Buy or You Grow, There's a Path for You"
            }
            items={twoWaysItems}
          />
        </Reveal>
      )}
      {productTiles.length > 0 && (
        <Reveal direction="up">
          <ImageTileGrid
            eyebrow={entry?.fields.productsEyebrow || "Our Products"}
            heading={entry?.fields.productsHeading || "Fresh produce across every major category"}
            items={productTiles}
            ctaLabel={entry?.fields.productsCtaLabel || "View All Products & Services"}
            ctaHref={entry?.fields.productsCtaHref || "/products"}
          />
        </Reveal>
      )}

      {carouselSlides.length > 0 && <Carousel slides={carouselSlides} />}

      <Reveal direction="up">
        <ImageText
          eyebrow={entry?.fields.storyEyebrow || "Our Story"}
          heading={entry?.fields.storyHeading || "From Farm to Fork, With Precision and Care"}
          body={
            entry?.fields.storyBody ||
            "Producing has built its reputation on sourcing the freshest produce and delivering it with the reliability our customers depend on. We're committed to quality, food safety, and long-term relationships — not one-time transactions."
          }
          imageUrl={storyImageUrl ? `https:${storyImageUrl}` : undefined}
          imageAlt={storyImageAlt}
          videoUrl={storyVideoUrl ? `https:${storyVideoUrl}` : undefined}
          linkLabel={entry?.fields.storyLinkLabel || "Our Story →"}
          linkHref={entry?.fields.storyLinkHref || "/about"}
        />
      </Reveal>
      {eventItems.length > 0 && (
        <Reveal direction="up">
          <EventsRail
            eyebrow={entry?.fields.eventsEyebrow || "Out in the Industry"}
            heading={entry?.fields.eventsHeading || "You'll Find Us at the Shows That Matter"}
            intro={entry?.fields.eventsIntro}
            items={eventItems}
            ctaLabel={entry?.fields.eventsCtaLabel || "See All Events"}
            ctaHref={entry?.fields.eventsCtaHref || "/events"}
          />
        </Reveal>
      )}

      <Reveal direction="up">
        <NewsletterBar />
      </Reveal>

      {entry?.fields.testimonialQuote && entry?.fields.testimonialAttribution && (
        <Reveal direction="up">
          <Testimonial
            quote={entry.fields.testimonialQuote}
            attribution={entry.fields.testimonialAttribution}
          />
        </Reveal>
      )}
    </>
  );
}
