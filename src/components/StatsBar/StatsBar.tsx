import { useEffect, useRef, useState } from "react";
import "./StatsBar.css";

export interface StatsBarItem {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsBarProps {
  items: StatsBarItem[];
  note?: string;
}

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1200;
    const start = performance.now();

    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <div className="stats-bar__num" ref={ref}>
      {display}
      {suffix ?? "+"}
    </div>
  );
}

export default function StatsBar({ items, note }: StatsBarProps) {
  return (
    <section className="stats-bar">
      <div className="stats-bar__inner">
        {items.map((item, i) => (
          <div className="stats-bar__stat" key={i}>
            <Counter value={item.value} suffix={item.suffix} />
            <div className="stats-bar__label">{item.label}</div>
          </div>
        ))}
      </div>
      {note && (
        <div className="stats-bar__note">
          <span>{note}</span>
        </div>
      )}
    </section>
  );
}
