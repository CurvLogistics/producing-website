import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomePage } from "../../lib/homeContent";
import type { HomePageEntry, FeatureCardFields } from "../../types/contentful";
import FeatureGrid, { type FeatureGridItem } from "../../components/FeatureGrid/FeatureGrid";
import ContentSection from "../../components/ContentSection/ContentSection";
import "./Home.css";

const NOW_SOURCING = ["🟢 Limes", "🍊 Citrus", "🥑 Avocados", "🍇 Table Grapes", "🍅 Tomatoes", "🥭 Mangoes", "🍍 Pineapple", "🥦 Vegetables"];

export default function Home() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<HomePageEntry | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    getHomePage()
      .then((result) => {
        if (cancelled) return;
        setEntry(result);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load homePage entry from Contentful", err);
        if (!cancelled) setStatus("error");
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
      icon: card.fields.icon,
      title: card.fields.title,
      body: card.fields.body,
      linkHref: card.fields.linkHref,
      linkLabel: card.fields.linkLabel,
    }));

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

      <section className="home-trust">
        <div className="home-trust__inner">
          <span>Trusted &amp; Experienced</span>
          <span>Reliable Availability</span>
          <span>Quality Guaranteed</span>
          <span>Relationship-Driven Service</span>
        </div>
      </section>

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

      <ContentSection
        status={status}
        hasEntry={!!entry}
        content={entry?.fields.content}
        fallbackAlt={heading}
      />

      {whatWeDoItems.length > 0 && (
        <FeatureGrid
          eyebrow={entry?.fields.whatWeDoEyebrow ?? "What We Do"}
          heading={entry?.fields.whatWeDoHeading ?? "One partner for sourcing, moving, and delivering produce"}
          intro={entry?.fields.whatWeDoIntro}
          items={whatWeDoItems}
        />
      )}
    </>
  );
}
