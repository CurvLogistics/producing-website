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

function parseBody(raw: string) {
  const blocks = raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const paragraphs: string[] = [];
  const bullets: string[] = [];

  blocks.forEach((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));

    if (isList) {
      bullets.push(...lines.map((line) => line.replace(/^- /, "")));
    } else {
      paragraphs.push(block);
    }
  });

  return { paragraphs, bullets };
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
          {items.map((item) => {
            const { paragraphs, bullets } = parseBody(item.body);
            return (
              <div className="feature-card" key={item.title}>
                <div className="feature-card__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                {paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {bullets.length > 0 && (
                  <ul className="feature-card__bullets">
                    {bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {item.linkHref && (
                  <Link className="feature-card__link" to={item.linkHref}>
                    {item.linkLabel ?? "Learn more →"}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
