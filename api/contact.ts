import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, phone, message } = req.body as ContactPayload;

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    res.status(400).json({ error: "Name, email, and phone are required." });
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  const results = await Promise.allSettled([sendEmail({ name, email, phone, message }), sendWhatsApp({ name, email, phone, message })]);

  const [emailResult, whatsappResult] = results;
  const emailFailed = emailResult.status === "rejected";

  if (emailResult.status === "rejected") {
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
}

async function sendEmail({ name, email, phone, message }: Required<Pick<ContactPayload, "name" | "email" | "phone">> & { message?: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone}`, "", "Message:", message || "(no message provided)"].join("\n"),
  });
}

async function sendWhatsApp({ name, email, phone, message }: Required<Pick<ContactPayload, "name" | "email" | "phone">> & { message?: string }) {
  const { CALLMEBOT_PHONE, CALLMEBOT_API_KEY } = process.env;

  if (!CALLMEBOT_PHONE || !CALLMEBOT_API_KEY) {
    // WhatsApp notifications are optional — skip silently if not configured yet.
    return;
  }

  const text = `New website inquiry from ${name}\n${phone} · ${email}\n\n${message || "(no message provided)"}`;

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", CALLMEBOT_PHONE);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", CALLMEBOT_API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`CallMeBot request failed with status ${res.status}`);
  }
}
