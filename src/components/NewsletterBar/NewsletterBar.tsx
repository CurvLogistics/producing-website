import "./NewsletterBar.css";

export default function NewsletterBar() {
  return (
    <section className="newsletter-bar">
      <div className="newsletter-bar__inner">
        <div>
          <h2>Stay Ahead of the Market</h2>
          <p>
            Get our weekly availability &amp; pricing sheet sent straight to your inbox, know
            what's fresh before you call.
          </p>
        </div>

        <form className="newsletter-bar__form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="you@company.com" required />
          <button type="submit" className="btn btn-primary">
            Get the Sheet
          </button>
        </form>
      </div>
    </section>
  );
}
