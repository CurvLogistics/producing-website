import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- API routes (replaces the Vercel serverless function in api/contact.ts) ---

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    res.status(400).json({ error: "Name, email, and phone are required." });
    return;
  }

  if (!EMAIL_PATTERN.test(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  const results = await Promise.allSettled([sendEmail({ name, email, phone, message }), sendWhatsApp({ name, email, phone, message })]);

  const [emailResult, whatsappResult] = results;
  const emailFailed = emailResult.status === "rejected";

  if (emailFailed) {
    console.error("Contact form: email send failed", emailResult.reason);
  }
  if (whatsappResult.status === "rejected") {
    console.error("Contact form: WhatsApp send failed", whatsappResult.reason);
  }

  // The submission only truly fails if the email notification couldn't be sent —
  // WhatsApp is a nice-to-have alert, not the record of truth.
  if (emailFailed) {
    res.status(502).json({ error: "Could not send your message right now. Please try again shortly." });
    return;
  }

  res.status(200).json({ ok: true });
});

async function sendEmail({ name, email, phone, message }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`, "", "Message:", message || "(no message provided)"].join("\n"),
  });
}

async function sendWhatsApp({ name, email, phone, message }) {
  const { CALLMEBOT_PHONE, CALLMEBOT_API_KEY } = process.env;

  if (!CALLMEBOT_PHONE || !CALLMEBOT_API_KEY) {
    // WhatsApp notifications are optional — skip silently if not configured.
    return;
  }

  const text = `New website inquiry from ${name}\n${phone} · ${email}\n\n${message || "(no message provided)"}`;

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", CALLMEBOT_PHONE);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", CALLMEBOT_API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`CallMeBot request failed with status ${response.status}`);
  }
}

// --- Runtime config for the frontend bundle ---
//
// GoDaddy's Node.js Hosting doesn't expose Secrets to the `vite build` step
// (only to the running server process), so VITE_CONTENTFUL_* never actually
// gets baked into the built JS the way it would on Vercel or in local dev —
// the bundle silently ships with these as undefined. To work around that,
// the server hands these values to the browser at request time instead, and
// src/lib/contentful.ts reads them from window.__APP_CONFIG__ if present,
// falling back to import.meta.env (so Vercel / `vite dev` still work
// unchanged).
app.get("/config.js", (req, res) => {
  res.type("application/javascript");
  res.send(
    `window.__APP_CONFIG__ = ${JSON.stringify({
      contentfulSpaceId: process.env.VITE_CONTENTFUL_SPACE_ID || "",
      contentfulAccessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN || "",
    })};`,
  );
});

// --- Static frontend (the Vite build output) ---

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback: any non-API GET request gets index.html so client-side routing
// (react-router-dom) can take over. Uses a path-less middleware (rather than
// an app.get("*", ...) route) because Express 5's path-to-regexp no longer
// accepts a bare "*" pattern.
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    next();
    return;
  }
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`producing-website listening on port ${port}`);
});