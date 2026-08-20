import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getEventsPage } from "../../lib/eventsContent";
import type {
  EventsPageEntry,
  UpcomingEventFields,
  EventGalleryGroupFields,
} from "../../types/contentful";
import Reveal from "../../components/Reveal/Reveal";
import "./Events.css";

type FilterMode = "all" | "upcoming" | "past";

const FILTER_OPTIONS: { value: FilterMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export default function Events() {
  const [entry, setEntry] = useState<EventsPageEntry | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getEventsPage()
      .then((result) => {
        if (cancelled) return;
        setEntry(result);
        setHasLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load eventsPage entry from Contentful", err);
        if (!cancelled) setHasLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const heroEyebrow = entry?.fields.heroEyebrow || "Where You'll Find Us";
  const heroHeading = entry?.fields.heroHeading || "Producing at Industry Events";
  const heroIntro =
    entry?.fields.heroIntro ||
    "We show up where the industry gathers — building relationships, meeting partners, and staying close to the market.";

  const heroImageField = entry?.fields.heroImage;
  const heroImageAsset = heroImageField && "fields" in heroImageField ? heroImageField : undefined;
  const heroImageUrl = heroImageAsset?.fields.file?.url;

  const upcomingEyebrow = entry?.fields.upcomingEyebrow || "Upcoming";
  const upcomingHeading = entry?.fields.upcomingHeading || "Where to Meet Us Next";

  const upcomingEvents = (entry?.fields.upcomingEvents ?? [])
    .filter((event): event is typeof event & { fields: UpcomingEventFields } => !!event && "fields" in event)
    .map((event) => {
      const imageField = event.fields.image;
      const imageAsset = imageField && "fields" in imageField ? imageField : undefined;
      const imageUrl = imageAsset?.fields.file?.url;
      return {
        imageUrl: imageUrl ? `https:${imageUrl}` : undefined,
        name: (event.fields.name as string | undefined) ?? "",
        href: event.fields.href as string | undefined,
      };
    })
    .filter((event) => event.imageUrl);

  const highlightsEyebrow = entry?.fields.highlightsEyebrow || "Recent Highlights";
  const highlightsHeading = entry?.fields.highlightsHeading || "Our Presence at Industry Events";

  const galleryGroups = (entry?.fields.galleryGroups ?? [])
    .filter((group): group is typeof group & { fields: EventGalleryGroupFields } => !!group && "fields" in group)
    .map((group) => {
      const imagesField = group.fields.images;
      const rawImages = (Array.isArray(imagesField) ? imagesField : imagesField ? [imagesField] : []) as unknown as Array<
        { fields?: { file?: { url?: string }; title?: string } } | undefined
      >;
      const images = rawImages
        .filter((asset): asset is { fields: { file?: { url?: string }; title?: string } } => !!asset && "fields" in asset)
        .map((asset) => ({
          url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : undefined,
          alt: asset.fields.title ?? "",
        }))
        .filter((image): image is { url: string; alt: string } => !!image.url);

      return {
        name: group.fields.name as string,
        note: group.fields.note as string,
        images,
      };
    });

  const ctaHeading = entry?.fields.ctaHeading || "Want to Meet Us in Person?";
  const ctaIntro = entry?.fields.ctaIntro || "Reach out to schedule time at our next industry event.";
  const ctaLabel = entry?.fields.ctaLabel || "Contact Us";
  const ctaHref = entry?.fields.ctaHref || "/contact";

  const searchLower = search.trim().toLowerCase();
  const showUpcoming = filterMode !== "past";
  const showPast = filterMode !== "upcoming";

  const filteredUpcoming = useMemo(
    () => upcomingEvents.filter((event) => !searchLower || event.name.toLowerCase().includes(searchLower)),
    [upcomingEvents, searchLower],
  );

  const filteredGroups = useMemo(
    () => galleryGroups.filter((group) => !searchLower || group.name.toLowerCase().includes(searchLower)),
    [galleryGroups, searchLower],
  );

  const activeFilterLabel = FILTER_OPTIONS.find((option) => option.value === filterMode)?.label;

  return (
    <>
      <section className="events-hero" style={heroImageUrl ? { backgroundImage: `url(https:${heroImageUrl})` } : undefined}>
        <div className="events-hero__overlay" />
        <div className="events-hero__inner">
          <div className="eyebrow">{heroEyebrow}</div>
          <h1>{heroHeading}</h1>
          <p>{heroIntro}</p>
        </div>
      </section>

      <section className="events-filterbar">
        <div className="events-filterbar__inner">
          <input
            type="search"
            className="events-search"
            placeholder="You can search and filter events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="events-filter">
            <button
              type="button"
              className="events-filter__toggle"
              onClick={() => setFilterOpen((open) => !open)}
            >
              {activeFilterLabel} <span aria-hidden="true">▾</span>
            </button>

            {filterOpen && (
              <div className="events-filter__menu">
                <div className="events-filter__label">Filter</div>
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="events-filter__option"
                    onClick={() => {
                      setFilterMode(option.value);
                      setFilterOpen(false);
                    }}
                  >
                    <span className="events-filter__check">{filterMode === option.value ? "✓" : ""}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {showUpcoming && filteredUpcoming.length > 0 && (
        <Reveal direction="up">
          <section className="events-section">
            <div className="events-section__inner">
              <div className="events-section__head">
                <div className="eyebrow">{upcomingEyebrow}</div>
                <h2>{upcomingHeading}</h2>
              </div>

              <div className="events-upcoming-grid">
                {filteredUpcoming.map((event, i) => {
                  const image = (
                    <>
                      <img src={event.imageUrl} alt={event.name} loading="lazy" />
                      {event.name && <span className="events-upcoming-image__label">{event.name}</span>}
                    </>
                  );

                  return event.href ? (
                    <Link className="events-upcoming-image" to={event.href} key={i}>
                      {image}
                    </Link>
                  ) : (
                    <div className="events-upcoming-image" key={i}>
                      {image}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {showPast && filteredGroups.length > 0 && (
        <Reveal direction="up">
          <section className="events-section events-section--alt">
            <div className="events-section__inner">
              <div className="events-section__head">
                <div className="eyebrow">{highlightsEyebrow}</div>
                <h2>{highlightsHeading}</h2>
              </div>

              {filteredGroups.map((group, i) => (
                <div className="events-group" key={i}>
                  <div className="events-group__head">
                    <h3>{group.name}</h3>
                    <span>{group.note}</span>
                  </div>
                  <div className="events-gallery">
                    {group.images.map((image, j) => (
                      <img key={j} src={image.url} alt={image.alt} loading="lazy" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {hasLoaded && (
      <Reveal direction="up">
        <section className="events-cta-section">
          <div className="events-cta">
            <svg className="events-cta__shape" viewBox="0 0 400 400" fill="none" aria-hidden="true">
              <path
                d="M60 300c0-60 60-90 100-50s-10 110-60 90-60-90 10-140 150-10 130 60-90 90-140 40"
                stroke="var(--amber-500)"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </svg>
            <div className="events-cta__content">
              <h2>{ctaHeading}</h2>
              <p>{ctaIntro}</p>
              <Link className="btn btn-primary" to={ctaHref}>
                {ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
      )}
    </>
  );
}
