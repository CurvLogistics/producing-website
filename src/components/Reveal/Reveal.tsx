import { useEffect, useRef, useState, type ReactNode } from "react";
import "./Reveal.css";

interface RevealProps {
  children: ReactNode;
  direction?: "left" | "right" | "up";
}

export default function Reveal({ children, direction = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal reveal--${direction}${visible ? " reveal--visible" : ""}`}>
      {children}
    </div>
  );
}
