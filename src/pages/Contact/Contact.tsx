import { useEffect, useState, type FormEvent } from "react";
import { getContactPage } from "../../lib/contactContent";
import type { ContactPageEntry } from "../../types/contentful";
import "./Contact.css";

type SubmitState = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "email" | "phone" | "consent";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [entry, setEntry] = useState<ContactPageEntry | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [consentChecked, setConsentChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});

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
    entry?.fields.successMessage || "Thank you, your message is on its way. We'll be in touch soon.";
  const errorMessage =
    entry?.fields.errorMessage || "Something went wrong sending your message. Please try again.";

  const galleryImages = (entry?.fields.gallery ?? [])
    .filter((asset): asset is typeof asset & { fields: { file?: { url?: string }; title?: string } } => !!asset && "fields" in asset)
    .map((asset) => ({
      url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : undefined,
      alt: asset.fields.title ?? "",
    }))
    .filter((image): image is { url: string; alt: string } => !!image.url);

  function validate(formData: FormData): Partial<Record<FieldName, string>> {
    const errors: Partial<Record<FieldName, string>> = {};
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const phone = (formData.get("phone") as string).trim();

    if (!name) errors.name = "Please enter your name.";
    if (!email) errors.email = "Please enter your email.";
    else if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";
    if (!phone) errors.phone = "Please enter your phone number.";
    if (!consentChecked) errors.consent = "Please confirm you agree before sending.";

    return errors;
  }

  function clearFieldError(field: FieldName) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
      setFieldErrors({});
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

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          <div className="contact__row">
            <div className={`contact__field${fieldErrors.name ? " contact__field--error" : ""}`}>
              <label htmlFor="name">Full Name*</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name*"
                onChange={() => clearFieldError("name")}
              />
              {fieldErrors.name && <span className="contact__field-error">{fieldErrors.name}</span>}
            </div>
            <div className={`contact__field${fieldErrors.email ? " contact__field--error" : ""}`}>
              <label htmlFor="email">Email*</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email*"
                onChange={() => clearFieldError("email")}
              />
              {fieldErrors.email && <span className="contact__field-error">{fieldErrors.email}</span>}
            </div>
          </div>

          <div className="contact__row">
            <div className={`contact__field${fieldErrors.phone ? " contact__field--error" : ""}`}>
              <label htmlFor="phone">Phone Number*</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number*"
                onChange={() => clearFieldError("phone")}
              />
              {fieldErrors.phone && <span className="contact__field-error">{fieldErrors.phone}</span>}
            </div>
            <div className="contact__field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Message" rows={1} />
            </div>
          </div>

          <div>
            <label className={`contact__consent${fieldErrors.consent ? " contact__consent--error" : ""}`}>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked);
                  clearFieldError("consent");
                }}
              />
              <span>{consentText}</span>
            </label>
            {fieldErrors.consent && <span className="contact__field-error">{fieldErrors.consent}</span>}
          </div>

          <button className="btn btn-primary contact__submit" type="submit" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? "Sending…" : submitLabel}
          </button>

          {submitState === "success" && <p className="contact__status contact__status--success">{successMessage}</p>}
          {submitState === "error" && <p className="contact__status contact__status--error">{errorMessage}</p>}
        </form>
      </div>

      {galleryImages.length > 0 && (
        <div className="contact__gallery">
          {entry?.fields.socialLabel && (
            <a
              className="contact__social"
              href={entry.fields.socialHref || "#"}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact__social-icon">📷</span>
              {entry.fields.socialLabel}
            </a>
          )}

          <div className="contact__gallery-grid">
            {galleryImages.map((image, i) => (
              <img key={i} src={image.url} alt={image.alt} loading="lazy" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
