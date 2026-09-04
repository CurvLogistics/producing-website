import { createClient } from "contentful";

declare global {
    interface Window {
        __APP_CONFIG__?: {
            contentfulSpaceId?: string;
            contentfulAccessToken?: string;
        };
    }
}

// On GoDaddy Node.js Hosting, the vite build step doesn't have access to the
// VITE_CONTENTFUL_* Secrets (only the running server does), so
// import.meta.env.VITE_CONTENTFUL_* is always empty in that build. server.js
// serves /config.js at request time with the real values from process.env,
// and index.html loads it before this bundle runs — so prefer that, and fall
// back to import.meta.env for local `vite dev` and Vercel, where build-time
// env vars work normally.
const runtimeConfig = typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined;

const space = runtimeConfig?.contentfulSpaceId || import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = runtimeConfig?.contentfulAccessToken || import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

export const contentfulClient = createClient({
    space,
    accessToken,
});