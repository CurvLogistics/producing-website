import { Link } from "react-router-dom";
import "./ImageTileGrid.css";

export interface ImageTileGridItem {
  label: string;
  imageUrl?: string;
  href?: string;
}

interface ImageTileGridProps {
  eyebrow?: string;
  heading: string;
  items: ImageTileGridItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function ImageTileGrid({ eyebrow, heading, items, ctaLabel, ctaHref }: ImageTileGridProps) {
  return (
    <section className="image-tile-grid">
      <div className="image-tile-grid__inner">
        <div className="image-tile-grid__head">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2>{heading}</h2>
        </div>

        <div className="image-tile-grid__tiles">
          {items.map((item) => {
            const style = item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined;
            const label = <div className="image-tile__label">{item.label}</div>;

            return item.href ? (
              <Link className="image-tile" key={item.label} to={item.href} style={style}>
                {label}
              </Link>
            ) : (
              <div className="image-tile" key={item.label} style={style}>
                {label}
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
