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
}: ImageTextProps) {
  return (
    <section className={`image-text${alt ? " image-text--alt" : ""}`}>
      <div className="image-text__inner">
        {videoUrl ? (
          <video className="image-text__video" poster={imageUrl} autoPlay muted loop playsInline>
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="image-text__image"
            style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
            role={imageUrl ? "img" : undefined}
            aria-label={imageUrl ? imageAlt : undefined}
          >
            {!imageUrl && <span>{imageAlt}</span>}
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
