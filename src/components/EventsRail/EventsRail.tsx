import { Link } from "react-router-dom";
import "./EventsRail.css";

export interface EventsRailItem {
  number: string;
  name: string;
  note: string;
  imageUrl?: string;
  href?: string;
}

interface EventsRailProps {
  eyebrow?: string;
  heading: string;
  intro?: string;
  items: EventsRailItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EventsRail({ eyebrow, heading, intro, items, ctaLabel, ctaHref }: EventsRailProps) {
  return (
    <section className="events-rail-section">
      <div className="events-rail-section__inner">
        <div className="events-rail-section__head">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2>{heading}</h2>
          {intro && <p>{intro}</p>}
        </div>

        <div className="events-rail">
          {items.map((item) => (
            <Link className="event-card" to={item.href ?? "/events"} key={item.number}>
              <div
                className="event-card__photo"
                style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
              >
                <span className="event-card__num">{item.number}</span>
              </div>
              <div className="event-card__body">
                <h4>{item.name}</h4>
                <p>{item.note}</p>
              </div>
            </Link>
          ))}

          {ctaLabel && ctaHref && (
            <div className="event-card event-card--cta">
              <Link className="btn btn-ghost" to={ctaHref}>
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
