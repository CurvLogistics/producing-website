import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsPage } from "../../lib/productsContent";
import type { ProductsPageEntry, FeatureCardFields, CarouselSlideFields } from "../../types/contentful";
import FeatureGrid, { type FeatureGridItem } from "../../components/FeatureGrid/FeatureGrid";
import Carousel, { type CarouselSlideData } from "../../components/Carousel/Carousel";
import ImageText from "../../components/ImageText/ImageText";
import Reveal from "../../components/Reveal/Reveal";
import "./Products.css";

const DUMMY_SLIDES: CarouselSlideData[] = [
  {
    mediaUrl: "",
    heading: "Consolidation Services",
    body: "We combine multiple shipments into efficient, full truckloads — cutting freight costs and simplifying logistics for our partners.",
  },
  {
    mediaUrl: "",
    heading: "Quality Inspections",
    body: "Every load is checked for freshness, quality, and food-safety compliance before it ever reaches your dock.",
  },
  {
    mediaUrl: "",
    heading: "In & Out Services",
    body: "Fast, reliable cross-docking keeps product moving quickly, minimizing storage time and maximizing freshness.",
  },
  {
    mediaUrl: "",
    heading: "Export Services",
    body: "Supplying fresh fruits and vegetables to international markets in line with export regulations and standards.",
  },
];

const DUMMY_SERVICES: FeatureGridItem[] = [
  {
    icon: "🛒",
    title: "Retail Sales",
    body: "A diverse selection of fresh produce for retail outlets and online platforms, with a focus on freshness, variety, and flexible order sizes.\n\n- Wide product variety\n- Freshness-first fulfillment\n- Flexible order sizes",
  },
  {
    icon: "📦",
    title: "Consolidation Services",
    body: "We combine multiple smaller shipments into full truckloads, cutting freight costs and streamlining delivery schedules for our partners.\n\n- Combines multiple shipments into full truckloads\n- Reduces freight costs\n- Simplifies scheduling for partners",
  },
  {
    icon: "🔍",
    title: "Inspections",
    body: "Every load is checked for quality, freshness, and food-safety compliance before it ships, so you always know what you're getting.\n\n- Freshness & quality checks on every load\n- Food-safety compliance verification\n- Documentation before it ships",
  },
  {
    icon: "🔄",
    title: "In & Out Services",
    body: "Fast cross-docking and in-and-out handling keeps product moving quickly, minimizing storage time and maximizing freshness.\n\n- Fast cross-docking\n- Minimal storage time\n- Keeps product moving and fresh",
  },
  {
    icon: "🌍",
    title: "Import Services",
    body: "Full compliance with import regulations and health/safety standards, giving you year-round, out-of-season availability and specialty sourcing.\n\n- Year-round, out-of-season availability\n- Cultural & specialty produce sourcing\n- Regulatory compliance handled end-to-end",
  },
  {
    icon: "🚢",
    title: "Export Services",
    body: "Supplying fresh fruits and vegetables to international markets — full documentation, logistics handling, and long-term buyer partnerships.\n\n- Full documentation & logistics handling\n- Market expansion support for growers\n- Long-term buyer & distributor partnerships",
  },
];

export default function Products() {
  const [entry, setEntry] = useState<ProductsPageEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProductsPage()
      .then((result) => {
        if (!cancelled) setEntry(result);
      })
      .catch((err) => console.error("Failed to load productsPage entry from Contentful", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const heroEyebrow = entry?.fields.heroEyebrow || "What We Offer";
  const heroHeading = entry?.fields.heroHeading || "Products & Services";
  const heroIntro =
    entry?.fields.heroIntro ||
    "Wholesale, retail, import/export, and distribution — Producing supports every step of getting fresh produce from the field to your shelf.";

  const heroImageField = entry?.fields.heroImage;
  const heroImageAsset = heroImageField && "fields" in heroImageField ? heroImageField : undefined;
  const heroImageUrl = heroImageAsset?.fields.file?.url;

  const gallerySlides: CarouselSlideData[] = (entry?.fields.gallerySlides ?? [])
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

  const carouselSlides = gallerySlides.length > 0 ? gallerySlides : DUMMY_SLIDES;

  const processEyebrow = entry?.fields.processEyebrow || "Process";
  const processHeading = entry?.fields.processHeading || "How It Works";
  const processBody =
    entry?.fields.processBody ||
    "We select produce from trusted farms and inspect every shipment for freshness, appearance, and safety. From there, our team handles washing, cutting, and custom packaging tailored to wholesale, retail, or foodservice needs. Our distribution network then ensures timely, reliable delivery to every customer — from sourcing to your door, every step is handled with care.";

  const servicesEyebrow = entry?.fields.servicesEyebrow || "Our Services";
  const servicesHeading = entry?.fields.servicesHeading || "How We Support Every Shipment";
  const servicesIntro = entry?.fields.servicesIntro;

  const serviceCards: FeatureGridItem[] = (entry?.fields.serviceCards ?? [])
    .filter((card): card is typeof card & { fields: FeatureCardFields } => !!card && "fields" in card)
    .map((card) => ({
      icon: card.fields.icon as string,
      title: card.fields.title as string,
      body: card.fields.body as string,
      linkHref: card.fields.linkHref as string | undefined,
      linkLabel: card.fields.linkLabel as string | undefined,
    }));

  const servicesItems = serviceCards.length > 0 ? serviceCards : DUMMY_SERVICES;

  const ctaHeading = entry?.fields.ctaHeading || "Have a Question About Our Services?";
  const ctaIntro = entry?.fields.ctaIntro || "Reach out and our team will walk you through the right solution for your business.";
  const ctaLabel = entry?.fields.ctaLabel || "Contact Us";
  const ctaHref = entry?.fields.ctaHref || "/contact";

  return (
    <>
      <section
        className="products-hero"
        style={heroImageUrl ? { backgroundImage: `url(https:${heroImageUrl})` } : undefined}
      >
        <div className="products-hero__overlay" />
        <div className="products-hero__inner">
          <div className="eyebrow">{heroEyebrow}</div>
          <h1>{heroHeading}</h1>
          <p>{heroIntro}</p>
        </div>
      </section>

      <Reveal direction="up">
        <FeatureGrid
          eyebrow={servicesEyebrow}
          heading={servicesHeading}
          intro={servicesIntro}
          items={servicesItems}
        />
      </Reveal>

      <Reveal direction="up">
        <Carousel slides={carouselSlides} />
      </Reveal>

      <Reveal direction="up">
        <ImageText eyebrow={processEyebrow} heading={processHeading} body={processBody} noImage />
      </Reveal>

      <Reveal direction="up">
        <section className="products-cta-section">
          <div className="products-cta">
            <svg className="products-cta__shape" viewBox="0 0 400 400" fill="none" aria-hidden="true">
              <path
                d="M60 300c0-60 60-90 100-50s-10 110-60 90-60-90 10-140 150-10 130 60-90 90-140 40"
                stroke="var(--amber-500)"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </svg>
            <div className="products-cta__content">
              <h2>{ctaHeading}</h2>
              <p>{ctaIntro}</p>
              <Link className="btn btn-primary" to={ctaHref}>
                {ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
