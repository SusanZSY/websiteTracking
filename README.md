# TMatch Tracking Demo

This repo is organized to support two separate website experiences in the same repository:

- [website](website) — the sample marketing site and redirect-test landing flow
- [dashboard](dashboard) — the analytics dashboard that reads the tracking data

## Repo structure

- website/
  - website_sample.html
  - redirect-test.html
  - website.css
  - tracking.js
- dashboard/
  - index.html
  - dashboard.css

## Deployment options

### Option 1: One GitHub Pages site with subfolders
This works if you want both experiences available under the same domain, for example:

- https://your-user.github.io/your-repo/website/website_sample.html
- https://your-user.github.io/your-repo/dashboard/index.html

This is the simplest deployment model if you want both sites in one repo without buying separate hostnames.

### Option 2: Two independent websites from one repo
If you want truly separate site deployments, GitHub Pages alone cannot host two independent root sites from the same repository. In that case, use one of these patterns:

- separate deploy targets such as Netlify, Vercel, or Cloudflare Pages
- two branches or two deployment folders
- one repo for the marketing site and a second repo for the dashboard

### Recommended for this project
For this demo, use:

- website and redirect-test together in the same folder
- dashboard in its own folder
- if you want them both exposed publicly, deploy the website and dashboard to two separate hosting targets or to a single GitHub Pages site using subfolder URLs

## Notes

- Links inside the website folder are relative, so the redirect test can live alongside the sample site without breaking.
- The dashboard is intentionally separate so it stays isolated from the website content and tracking logic.
