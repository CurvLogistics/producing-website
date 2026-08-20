import { useEffect, useState, type FormEvent } from "react";
import { getContactPage } from "../../lib/contactContent";
import type { ContactPageEntry } from "../../types/contentful";
import "./Contact.css";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [entry, setEntry] = useState<ContactPageEntry | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getContactPage()
      .then((result) => {
        if (!cancelled) setEntry(result);
      })
      .catch((err) => console.error("Failed to load contactPage entry from Contentful", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const eyebrow = entry?.fields.eyebrow || "Get In Touch";
  const heading = entry?.fields.heading || "Contact Us";
  const intro =
    entry?.fields.intro ||
    "Tell us what you need and our team will get back to you shortly.";
  const consentText =
    entry?.fields.consentText ||
    "I agree to be contacted by Producing Inc about my inquiry.";
  const submitLabel = entry?.fields.submitLabel || "Send";
  const successMessage =
    entry?.fields.successMessage || "Thanks — your message is on its way. We'll be in touch soon.";
  const errorMessage =
    entry?.fields.errorMessage || "Something went wrong sending your message. Please try again.";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setSubmitState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setSubmitState("success");
      form.reset();
      setConsentChecked(false);
    } catch (err) {
      console.error("Contact form submission failed", err);
      setSubmitState("error");
    }
  }

  return (
    <section className="contact">
      <div className="contact__inner">
        <div className="contact__head">
          {entry?.fields.eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1>{heading}</h1>
          {entry?.fields.intro && <p>{intro}</p>}
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="name">Full Name*</label>
              <input id="name" name="name" type="text" placeholder="Full Name*" required />
            </div>
            <div className="contact__field">
              <label htmlFor="email">Email*</label>
              <input id="email" name="email" type="email" placeholder="Email*" required />
            </div>
          </div>

          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="phone">Phone Number*</label>
              <input id="phone" name="phone" type="tel" placeholder="Phone Number*" required />
            </div>
            <div className="contact__field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Message" rows={1} />
            </div>
          </div>

          <label className="contact__consent">
            <input
              type="checkbox"
              required
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
            />
            <span>{consentText}</span>
          </label>

          <button className="btn btn-primary contact__submit" type="submit" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? "Sending…" : submitLabel}
          </button>

          {submitState === "success" && <p className="contact__status contact__status--success">{successMessage}</p>}
          {submitState === "error" && <p className="contact__status contact__status--error">{errorMessage}</p>}
        </form>
      </div>
    </section>
  );
}
