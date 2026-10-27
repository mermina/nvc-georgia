# NVC Georgia website

Bilingual (English / Georgian) site for the NVC Georgia team, built with AI assistance.

- **Edit content:** Pages CMS (https://app.pagescms.org) — texts, team, materials and news live in `src/_data/` and `src/content/`.
- **Build:** Eleventy (`npm install`, `npx @11ty/eleventy` → `_site/`).
- **Publish:** every change to `main` runs `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages.
- **Images:** `img/` (also the Pages CMS media folder).

The `.html`, `styles.css` and `app.js` files in the repository root are the earlier hand-off version and are no longer used once Pages is set to deploy from GitHub Actions.
