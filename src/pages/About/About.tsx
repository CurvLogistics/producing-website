import { useEffect, useState } from "react";
import { getAboutPage } from "../../lib/aboutContent";
import type { AboutPageEntry, FeatureCardFields, TeamMemberFields } from "../../types/contentful";
import ImageText from "../../components/ImageText/ImageText";
import FeatureGrid, { type FeatureGridItem } from "../../components/FeatureGrid/FeatureGrid";
import ImageTileGrid, { type ImageTileGridItem } from "../../components/ImageTileGrid/ImageTileGrid";
import StatsBar, { type StatsBarItem } from "../../components/StatsBar/StatsBar";
import Reveal from "../../components/Reveal/Reveal";
import "./About.css";

export default function About() {
  const [entry, setEntry] = useState<AboutPageEntry | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAboutPage()
      .then((result) => {
        if (!cancelled) setEntry(result);
      })
      .catch((err) => console.error("Failed to load aboutPage entry from Contentful", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const heroEyebrow = entry?.fields.heroEyebrow || "Who We Are";
  const heroHeading = entry?.fields.heroHeading || "A Trusted Produce Partner, Not Just Another Supplier";
  const heroIntro =
    entry?.fields.heroIntro ||
    "Producing is an industry leader driven by relationships, reliability, and a passion for fresh produce done right.";

  const heroImageField = entry?.fields.heroImage;
  const heroImageAsset = heroImageField && "fields" in heroImageField ? heroImageField : undefined;
  const heroImageUrl = heroImageAsset?.fields.file?.url;

  const storyHeading = entry?.fields.storyHeading || "From Farm to Fork";
  const storyBody =
    entry?.fields.storyBody ||
    "When it comes to fresh fruits and vegetables, we're not just another player — we're focused on doing it right. With years of experience and a passion for bringing the freshest produce to our customers, we've earned our place as an industry leader. Whether it's sourcing the ripest produce, delivering on time, or meeting the highest food safety standards, we treat every order with the same level of care.";

  const storyImageField = entry?.fields.storyImage;
  const storyImageAsset = storyImageField && "fields" in storyImageField ? storyImageField : undefined;
  const storyImageUrl = storyImageAsset?.fields.file?.url;
  const storyImageAlt = storyImageAsset?.fields.title ?? "Team at the warehouse";

  const statItems: StatsBarItem[] = [
    { value: entry?.fields.stat1Value ?? 15, label: entry?.fields.stat1Label || "Years in Business*" },
    { value: entry?.fields.stat2Value ?? 500, label: entry?.fields.stat2Label || "Customers Served*" },
    { value: entry?.fields.stat3Value ?? 20, label: entry?.fields.stat3Label || "States / Countries Shipped*" },
    { value: entry?.fields.stat4Value ?? 40, label: entry?.fields.stat4Label || "Produce Varieties*" },
  ];
  const statsNote =
    entry?.fields.statsNote || "*Placeholder figures — to be replaced with real numbers.";

  const valuesEyebrow = entry?.fields.valuesEyebrow || "Our Values";
  const valuesHeading = entry?.fields.valuesHeading || "What Drives Us";

  const valuesItems: FeatureGridItem[] = (entry?.fields.valuesCards ?? [])
    .filter((card): card is typeof card & { fields: FeatureCardFields } => !!card && "fields" in card)
    .map((card) => ({
      icon: card.fields.icon as string,
      title: card.fields.title as string,
      body: card.fields.body as string,
      linkHref: card.fields.linkHref as string | undefined,
      linkLabel: card.fields.linkLabel as string | undefined,
    }));

  const newsEyebrow = entry?.fields.newsEyebrow || "Latest at Producing";
  const newsHeading = entry?.fields.newsHeading || "Industry Presence & Updates";

  const newsItems: FeatureGridItem[] = (entry?.fields.newsCards ?? [])
    .filter((card): card is typeof card & { fields: FeatureCardFields } => !!card && "fields" in card)
    .map((card) => ({
      icon: card.fields.icon as string,
      title: card.fields.title as string,
      body: card.fields.body as string,
      linkHref: card.fields.linkHref as string | undefined,
      linkLabel: card.fields.linkLabel as string | undefined,
    }));

  const teamEyebrow = entry?.fields.teamEyebrow || "Our Team";
  const teamHeading = entry?.fields.teamHeading || "The People Behind Producing";

  const teamItems: ImageTileGridItem[] = (entry?.fields.ourTeam ?? [])
    .filter((member): member is typeof member & { fields: TeamMemberFields } => !!member && "fields" in member)
    .map((member) => {
      const imageField = member.fields.image;
      const imageAsset = imageField && "fields" in imageField ? imageField : undefined;
      const imageUrl = imageAsset?.fields.file?.url;
      return {
        label: member.fields.name as string,
        subtitle: member.fields.role as string | undefined,
        imageUrl: imageUrl ? `https:${imageUrl}` : undefined,
        href: member.fields.href as string | undefined,
      };
    });

  return (
    <>
      <section className="about-hero">
        <div
          className="about-hero__bg"
          style={heroImageUrl ? { backgroundImage: `url(https:${heroImageUrl})` } : undefined}
        />
        <div className="about-hero__overlay" />

        <svg className="about-hero__shape" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <path
            d="M60 300c0-60 60-90 100-50s-10 110-60 90-60-90 10-140 150-10 130 60-90 90-140 40"
            stroke="var(--amber-500)"
            strokeWidth="14"
            strokeLinecap="round"
          />
        </svg>

        <div className="about-hero__inner">
          <div className="eyebrow about-hero__reveal" style={{ animationDelay: "0.05s" }}>
            {heroEyebrow}
          </div>
          <h1 className="about-hero__reveal" style={{ animationDelay: "0.15s" }}>
            {heroHeading}
          </h1>
          <p className="about-hero__reveal" style={{ animationDelay: "0.25s" }}>
            {heroIntro}
          </p>
        </div>
      </section>

      <Reveal direction="up">
        <ImageText
          heading={storyHeading}
          body={storyBody}
          imageUrl={storyImageUrl ? `https:${storyImageUrl}` : undefined}
          imageAlt={storyImageAlt}
          alt
          compact
        />
      </Reveal>

      <StatsBar items={statItems} note={statsNote} />

      {valuesItems.length > 0 && (
        <Reveal direction="up">
          <FeatureGrid eyebrow={valuesEyebrow} heading={valuesHeading} items={valuesItems} />
        </Reveal>
      )}

      {newsItems.length > 0 && (
        <Reveal direction="up">
          <FeatureGrid alt eyebrow={newsEyebrow} heading={newsHeading} items={newsItems} />
        </Reveal>
      )}

      {teamItems.length > 0 && (
        <Reveal direction="up">
          <ImageTileGrid
            eyebrow={teamEyebrow}
            heading={teamHeading}
            items={teamItems}
            labelPosition="below"
          />
        </Reveal>
      )}
    </>
  );
}
