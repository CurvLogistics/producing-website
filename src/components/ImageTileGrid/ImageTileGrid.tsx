import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ImageTileGrid.css";

export interface ImageTileGridItem {
  label: string;
  subtitle?: string;
  imageUrl?: string;
  href?: string;
}

interface ImageTileGridProps {
  eyebrow?: string;
  heading: string;
  items: ImageTileGridItem[];
  ctaLabel?: string;
  ctaHref?: string;
  labelPosition?: "overlay" | "below";
}

export default function ImageTileGrid({
  eyebrow,
  heading,
  items,
  ctaLabel,
  ctaHref,
  labelPosition = "overlay",
}: ImageTileGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="image-tile-grid">
      <div className="image-tile-grid__inner">
        <div className="image-tile-grid__head">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2>{heading}</h2>
        </div>

        <div
          className={`image-tile-grid__tiles${visible ? " image-tile-grid__tiles--visible" : ""}`}
          ref={gridRef}
        >
          {items.map((item) => {
            const style = item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined;

            const photo =
              labelPosition === "below" ? (
                <div className="image-tile__photo" style={style} />
              ) : (
                <div className="image-tile__label">{item.label}</div>
              );

            const caption =
              labelPosition === "below" ? (
                <div className="image-tile__caption">
                  <div className="image-tile__name">{item.label}</div>
                  {item.subtitle && <div className="image-tile__role">{item.subtitle}</div>}
                </div>
              ) : null;

            const content = (
              <>
                {photo}
                {caption}
              </>
            );

            const className = `image-tile${labelPosition === "below" ? " image-tile--card" : ""}`;
            const wrapperStyle = labelPosition === "below" ? undefined : style;

            return item.href ? (
              <Link className={className} key={item.label} to={item.href} style={wrapperStyle}>
                {content}
              </Link>
            ) : (
              <div className={className} key={item.label} style={wrapperStyle}>
                {content}
              </div>
            );
          })}
        </div>

        {ctaLabel && ctaHref && (
          <div className="image-tile-grid__cta">
            <Link className="btn btn-outline-dark" to={ctaHref}>
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
