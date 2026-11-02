# Mission Bay Community News — Design Brief

Site: https://missionbaynews.us · Repo: `Lexiannax/missionbay` · Editor: Alexandra McKeever

## Purpose

A reliable, local source of news for the residents of Mission Bay (15333 Wicks Blvd, San Leandro, California, est. 1971). Residents are mostly older adults. The site is resident-run and **not affiliated with park management**.

## Goals

1. Publish community news the editor writes, like a blog.
2. Gather local and official news headlines in one place (an aggregator).
3. Keep every monthly newsletter available to everyone.
4. Make the site easy to read and use for older adults.
5. Leave room to add photos, video and resident comments later.

## Users

- **Residents** read the site. They do not need accounts.
- **The editor** (one admin) writes and edits articles, newsletter issues, pages, resource lists and aggregator settings in a browser editor, with no coding.

## Architecture

| Piece | Choice | Why |
|---|---|---|
| Site generator | Astro (static) | Fast, free to host, no server to maintain, articles are plain Markdown |
| Hosting | GitHub Pages, deployed by GitHub Actions | Free; domain already points at it |
| Editor | Sveltia CMS at `/admin/` | Browser editor that saves to GitHub; no login server needed for a single admin |
| Aggregator | `scripts/fetch-news.mjs` run at build time | Builds a static `news.json`; no server; refreshed every 3 hours |
| Domain | `missionbaynews.us` (Namecheap DNS → GitHub Pages) | Already configured |

Content lives in the repo:

- `src/content/articles/` — articles (Markdown)
- `src/content/newsletters/` + `public/newsletters/` — issue entries and PDFs
- `src/content/pages/` — "Your Rights" and "About" pages
- `src/data/` — resources, park data, news sources, hide-list, blocked words

## Pages

Home · Mission Bay News (articles) · Local News (aggregator) · Newsletter archive · Resources · About, plus Your Rights (`/rights/`), Park Rent Data (`/park-data/`), RSS feed (`/rss.xml`) and a 404 page.

## Aggregator rules

- Headline, a short snippet (about 220 characters), the source name and a link back to the original story. Never full articles.
- Sources are listed in `src/data/sources.json` and are editable in the CMS. A failing feed is skipped.
- The editor can hide a single story (`hidden-news.json`) or block stories containing certain words (`blocked-words.json`).
- Stories older than 14 days are dropped.

## Design requirements

- Navy and gold look from the original site, with Georgia serif body text.
- 18px base text, with Text size buttons for larger (21px) and extra large (24px) text; the choice is remembered.
- High contrast, 44px-plus tap targets, visible keyboard focus, "skip to content" link, semantic tables with headers.
- Works on phones, tablets and desktops. Navigation has six items.

## Decisions made

- The newsletter archive sits behind a **register-to-read page** (name and lot number, remembered on the visitor's own device, nothing collected or stored). This is a courtesy step, **not security**: the site is static and the PDFs are in a public repo, so anyone with a PDF link can open it. Real protection would need a login service such as Supabase with private file storage and approval of each resident. Decided by the editor on 2026-11-01 to keep the simple wall for now.
- Contact email shown on the site is missionbaynews@gmail.com.
- Newsletter PDFs were moved from Google Drive into the repo (`public/newsletters/`).
- The repo is public so GitHub Pages works on a free plan. **Anything committed to the repo is public, including drafts. Never put private information in it.**

## Later phases

1. **Email signup** for new issues (Buttondown or Mailchimp).
2. **Photo galleries** (images in `public/uploads/`, resized at build time).
3. **Video:** embed from YouTube or Vimeo; do not store large video files in the repo.
4. **Comments:** Facebook login needs a Meta developer app and review, and comments need moderation (approve before showing) and a comment policy. Decide before building.
5. **More news sources:** East Bay Times, KQED, Patch and senior-focused sources need working feed addresses.

## Open items

- Mission Bay is listed as **366 spaces** in the park data but "400+ households/spaces" appeared on the old homepage. The new site avoids stating a space count outside the park data table. Confirm the right number.
- Draft articles are visible in the public repo even though the site hides them.
