import "./Placeholder.css";

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <section className="placeholder">
      <div className="placeholder__inner">
        <div className="eyebrow">Coming Soon</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
