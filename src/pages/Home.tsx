import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import { getHomePage } from "../lib/homeContent";
import type { HomePageEntry } from "../types/contentful";
import "./Home.css";

// Content editors embed the section image directly in the "Content" rich
// text field (Insert Media). This pulls that first embedded asset out so it
// can be rendered as the standalone image column, and richTextOptions below
// hides it from the inline text flow so it isn't shown twice.
function findEmbeddedAsset(document?: Document) {
  const assetNode = document?.content.find((node) => node.nodeType === BLOCKS.EMBEDDED_ASSET);
  const target = (assetNode?.data as { target?: unknown } | undefined)?.target;
  if (target && typeof target === "object" && "fields" in target) {
    return target as { fields: { file?: { url?: string }; title?: string } };
  }
  return undefined;
}

const richTextOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: () => null,
  },
};

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

  const contentAsset = findEmbeddedAsset(entry?.fields.content);
  const contentImageUrl = contentAsset?.fields.file?.url;
  const contentImageAlt = contentAsset?.fields.title ?? heading;

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

        <svg
          className="home-hero__shape"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
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

      <section className="home-body">
        <div className="home-body__inner">
          {contentImageUrl && (
            <img
              className="home-body__image"
              src={`https:${contentImageUrl}`}
              alt={contentImageAlt}
            />
          )}

          <div className="home-body__content">
            {status === "loading" && <p>Loading content…</p>}
            {status === "error" && (
              <p>
                Couldn't load content from Contentful. Check your{" "}
                <code>VITE_CONTENTFUL_SPACE_ID</code> and{" "}
                <code>VITE_CONTENTFUL_ACCESS_TOKEN</code> in <code>.env</code>.
              </p>
            )}
            {status === "ready" && !entry && (
              <p>
                No <code>homePage</code> entry found yet — publish one in Contentful to
                see it here.
              </p>
            )}
            {entry?.fields.content &&
              documentToReactComponents(entry.fields.content, richTextOptions)}
          </div>
        </div>
      </section>
    </>
  );
}
