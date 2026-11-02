# Mission Bay Community News

Source for https://missionbaynews.us. See `docs/superpowers/specs/2026-11-01-mission-bay-news-design.md` for the design brief.

## Publishing (for the editor)

1. Go to https://missionbaynews.us/admin/ and click **Sign In Using Access Token** (the second button, not "Sign In with GitHub"). The pop-up has a link that opens GitHub's token page with the right permissions already chosen. Create the token, copy it, paste it into the box and sign in. (The plain "Sign in with GitHub" button needs an extra login helper that this site does not have.) Keep the token private, like a password.
2. Choose **Articles → New Article**, fill it in and click **Publish**.
3. The site rebuilds automatically and shows the change in about a minute or two.

To keep an article off the site while you work on it, turn on **Draft**. Note that the repo is public, so draft text can still be read on GitHub.

## Running locally

```
npm install
npm run dev          # http://localhost:4321
npm run build        # fetches headlines, then builds into dist/
npm run build:offline  # build without fetching headlines
```

## Layout

- `src/pages/` — pages
- `src/content/` — articles, newsletter issues, "Your Rights" and "About" text
- `src/data/` — resources, park data, news sources
- `scripts/fetch-news.mjs` — builds the Local News list
- `public/admin/` — the editor (Sveltia CMS)
- `.github/workflows/deploy.yml` — builds and deploys on every push, and every 3 hours to refresh headlines
