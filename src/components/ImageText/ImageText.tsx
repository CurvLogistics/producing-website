import { Link } from "react-router-dom";
import "./ImageText.css";

interface ImageTextProps {
  eyebrow?: string;
  heading: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  linkLabel?: string;
  linkHref?: string;
  alt?: boolean;
  compact?: boolean;
}

export default function ImageText({
  eyebrow,
  heading,
  body,
  imageUrl,
  imageAlt,
  videoUrl,
  linkLabel,
  linkHref,
  alt,
  compact,
}: ImageTextProps) {
  return (
    <section className={`image-text${alt ? " image-text--alt" : ""}`}>
      <div className="image-text__inner">
        {videoUrl ? (
          <video className="image-text__video" poster={imageUrl} autoPlay muted loop playsInline>
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : imageUrl ? (
          <img
            className={`image-text__image${compact ? " image-text__image--compact" : ""}`}
            src={imageUrl}
            alt={imageAlt ?? ""}
          />
        ) : (
          <div className="image-text__image image-text__image--placeholder">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M4 17.5l5-5 3.5 3.5L17 11l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{imageAlt}</span>
          </div>
        )}

        <div>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2>{heading}</h2>
          <p>{body}</p>
          {linkLabel && linkHref && (
            <Link className="btn btn-ghost" to={linkHref}>
              {linkLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
