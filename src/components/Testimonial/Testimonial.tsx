import "./Testimonial.css";

interface TestimonialProps {
  quote: string;
  attribution: string;
}

export default function Testimonial({ quote, attribution }: TestimonialProps) {
  return (
    <section className="testimonial">
      <div className="testimonial__inner">
        <p>&ldquo;{quote}&rdquo;</p>
        <div className="testimonial__attribution">{attribution}</div>
      </div>
    </section>
  );
}
