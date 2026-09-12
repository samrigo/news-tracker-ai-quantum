# Tideline

Media intelligence desk for AI, quantum computing, and policy — Meltwater-style coverage, social listening, AI visibility, regulation, markets, and Hedgeye-style signals.

Live site: [https://samrigo.github.io/news-tracker-ai-quantum/](https://samrigo.github.io/news-tracker-ai-quantum/)

Repo: [samrigo/news-tracker-ai-quantum](https://github.com/samrigo/news-tracker-ai-quantum)

## GitHub Pages

Push to `main` deploys via `.github/workflows/pages.yml`.

Site URL: `https://samrigo.github.io/news-tracker-ai-quantum/`

Hash routes: `/#/media`, `/#/social`, `/#/visibility`, `/#/policy`, `/#/markets`, `/#/signals`.

If the first Actions run fails on Pages permissions:

1. Repo **Settings → Pages → Source** = **GitHub Actions**
2. If the repo is private, Pages on GitHub Free needs it **public** (or GitHub Pro)

```bash
npm install
npm run build:pages   # writes dist/pages
```

Pages is static. Ask Helix, live ingest, and live quotes need a Node host. On Pages those features fall back to sample desk data.

## Local

```bash
npm install
npm run dev
```
