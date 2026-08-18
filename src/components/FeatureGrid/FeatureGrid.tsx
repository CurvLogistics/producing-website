import { Link } from "react-router-dom";
import "./FeatureGrid.css";

export interface FeatureGridItem {
  icon: string;
  title: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
}

interface FeatureGridProps {
  eyebrow?: string;
  heading: string;
  intro?: string;
  items: FeatureGridItem[];
  alt?: boolean;
}

export default function FeatureGrid({ eyebrow, heading, intro, items, alt }: FeatureGridProps) {
  return (
    <section className={`feature-grid${alt ? " feature-grid--alt" : ""}`}>
      <div className="feature-grid__inner">
        <div className="feature-grid__head">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2>{heading}</h2>
          {intro && <p>{intro}</p>}
        </div>

        <div className="feature-grid__cards">
          {items.map((item) => (
            <div className="feature-card" key={item.title}>
              <div className="feature-card__icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {item.linkHref && (
                <Link className="feature-card__link" to={item.linkHref}>
                  {item.linkLabel ?? "Learn more →"}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}