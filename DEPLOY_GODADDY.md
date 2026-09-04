# Deploying producing-website to GoDaddy Node.js Hosting

## What changed and why

This repo was built for Vercel: `vercel.json` rewrites everything except
`/api/*` to `index.html`, and `api/contact.ts` is a Vercel serverless
function (auto-mapped by file path, no server required). GoDaddy's Node.js
Hosting runs a single persistent Node process instead — there's no
equivalent of Vercel's `api/` auto-mapping, and it requires a `start` script
and a `main` field in `package.json`, neither of which existed here.

Three files were added/changed, and nothing existing was removed, so the
repo can still deploy to Vercel unchanged if you ever want to:

- **`server.js`** (new) — an Express server that serves the built `dist/`
  folder, re-implements the `/api/contact` endpoint (same validation, same
  Resend email + optional CallMeBot WhatsApp notification logic as
  `api/contact.ts`), and falls back to `index.html` for client-side routes
  so `react-router-dom` keeps working.
- **`package.json`** — added `express` as a dependency, `"start": "node
  server.js"`, `"main": "server.js"`, and an `engines.node: "22.x"` hint.
  (`package-lock.json` will update automatically the next time `npm
  install` runs.)
- **`.env.example`** (new) — documents every environment variable the app
  needs.

Verified locally: `npm run build` succeeds, `node server.js` serves the
built site, `/products` (a client-side route) correctly falls back to
`index.html`, and `POST /api/contact` returns the right 400s for missing
fields / a bad email address (I did not have real Resend/Contentful
credentials to test an actual successful send).

## Applying this

I don't currently have push access to `CurvLogistics/producing-website`
from this session, so I couldn't open a PR directly. Two ways to get these
three files in:

1. **Grant this session access to the repo** (add it to the session's
   authorized sources) and ask me to open a pull request — I'll push a
   branch and you can review the diff before merging.
2. **Apply manually** — drop `server.js` and `.env.example` into the repo
   root, replace `package.json` with the updated version, then run `npm
   install` locally to refresh `package-lock.json`, and commit.

## Setting it up on GoDaddy

1. In your GoDaddy account, go to **Web Hosting Deluxe → Node.js Hosting**
   (currently in beta) and choose **Connect GitHub repository**, pointing
   it at `CurvLogistics/producing-website` on the branch with these
   changes.
2. GoDaddy reads `package.json` automatically — it will run the `build`
   script (`tsc -b && vite build`) and then the `start` script (`node
   server.js`). No custom build/start commands should be needed.
3. Add these environment variables in GoDaddy's Node.js Hosting environment
   settings (enter the real values yourself in GoDaddy's dashboard — I
   won't handle API keys directly):
   - `VITE_CONTENTFUL_SPACE_ID`
   - `VITE_CONTENTFUL_ACCESS_TOKEN`
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`
   - `CALLMEBOT_PHONE` / `CALLMEBOT_API_KEY` (optional — WhatsApp alert is
     skipped silently if these aren't set)
4. Point `producinginc.com`'s DNS at the Node.js Hosting app once it's live
   and you've smoke-tested the contact form end to end.

## Caveats

- GoDaddy Node.js Hosting is in **beta** — expect some rough edges, and
  don't be surprised if behavior shifts as GoDaddy iterates on it.
- Test the contact form for real (a real submission) before pointing the
  live domain at it, since I could only verify request validation, not an
  actual Resend send or CallMeBot call.
