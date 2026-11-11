# Mission Bay Community News

Source for https://missionbaynews.us.

## Overview

Editor details are kept outside this repository.
Editor details are kept outside this repository.
Editor details are kept outside this repository.

Editor details are kept outside this repository.

## Guides


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
