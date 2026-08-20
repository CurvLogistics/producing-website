import { useEffect, useRef, useState } from "react";
import "./Carousel.css";

export interface CarouselSlideData {
  mediaUrl: string;
  mediaType?: "image" | "video";
  posterUrl?: string;
  heading?: string;
  body?: string;
}

interface CarouselProps {
  slides: CarouselSlideData[];
  autoPlayMs?: number;
}

export default function Carousel({ slides, autoPlayMs = 6000 }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!autoPlayMs || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, autoPlayMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlayMs, slides.length]);

  if (slides.length === 0) return null;

  const goTo = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <section className="carousel">
      {slides.map((slide, i) => (
        <div className={`carousel__slide${i === index ? " carousel__slide--active" : ""}`} key={i}>
          {slide.mediaType === "video" ? (
            <video className="carousel__media" poster={slide.posterUrl} autoPlay muted loop playsInline>
              <source src={slide.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="carousel__media" style={{ backgroundImage: `url(${slide.mediaUrl})` }} />
          )}
          <div className="carousel__overlay" />
          {(slide.heading || slide.body) && (
            <div className="carousel__text">
              {slide.heading && <h2>{slide.heading}</h2>}
              {slide.body && <p>{slide.body}</p>}
            </div>
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            className="carousel__arrow carousel__arrow--prev"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="carousel__arrow carousel__arrow--next"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="carousel__dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`carousel__dot${i === index ? " carousel__dot--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
