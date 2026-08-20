import { useNavigate } from "react-router-dom";
import "./SegmentSplit.css";

export interface SegmentSplitItem {
    icon: string;
    title: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
    highlight?: boolean;
}

interface SegmentSplitProps {
  eyebrow?: string;
  heading: string;
  items: SegmentSplitItem[];
}

export default function SegmentSplit({ eyebrow, heading, items }: SegmentSplitProps) {
  const navigate = useNavigate();

  return (
    <section className="segment-split">
      <div className="segment-split__inner">
        <div className="segment-split__head">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2>{heading}</h2>
        </div>

        <div className="segment-split__grid">
          {items.map((item) => (
            <div
              className={`segment-card${item.highlight ? " segment-card--amber" : ""}`}
              key={item.title}
            >
              <span className="segment-card__icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <button className="btn" onClick={() => navigate(item.buttonHref)}>
                {item.buttonLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}