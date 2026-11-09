# Monthly checklist and how to fix things

## Each month, to publish a newsletter issue

1. Finish the issue and save the PDF as `mission-bay-news-YYYY-MM.pdf` (for example `mission-bay-news-2026-12.pdf`).
2. Upload the PDF to the private residents' library (Google Drive).
3. On the site, go to `/admin/` → **Newsletter issues → New**. Set the title ("December 2026"), the issue date (the 1st of the month) and **Who can read it: Residents only**. Leave the PDF empty.
4. After about 12 months, change that issue to **Everyone (public)** and attach its PDF so it joins the public archive.

## Other everyday jobs (all in `/admin/`)

- **Post an article:** Articles → New Article.
- **Add an event:** Events → New Event.
- **Change contacts or resources:** Lists & settings → Resources & contacts.
- **Hide a bad news story:** Lists & settings → Hide a news story.

## Turning the whole site on or off

`/admin/` → **Lists & settings → Site on or off**.
- Switch **on**: shows the "Under Construction" page on the home page.
- Switch **off**: shows the real home page.

The change goes live in about two minutes. Other pages can still be reached by their web address while the home page is hidden.

## If something breaks

1. Go to GitHub: `github.com/Lexiannax/missionbay` → **Actions**. A red mark means the last update failed. Click it to see why.
2. To undo a bad change: GitHub → **Commits** → open the last good commit → **Browse files**, or ask for help.
3. The site copy on your computer is `1-Website/site`. Run `npm install` once, then `npm run dev` to preview at http://localhost:4321.

## Who holds what (fill this in)

| Item | Held by |
|---|---|
| GitHub account (`Lexiannax`) | |
| Shared Gmail (`missionbaynews@gmail.com`) | |
| Domain `missionbaynews.us` | |
| Sign-up form responses sheet | |
| Group managers | |
