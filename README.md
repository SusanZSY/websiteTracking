# TMatch Tracking Demo

This repo contains a static marketing website and a separate analytics dashboard. They are intentionally split into folders so they can be deployed from the same GitHub repository as a GitHub Pages project.

## Folder structure

- [website](website)
  - [website/index.html](website/index.html) — main marketing landing page
  - [website/redirect-test.html](website/redirect-test.html) — redirect landing test page
  - [website/website.css](website/website.css) — website styling
  - [website/tracking.js](website/tracking.js) — browser tracking logic
  - [website/website_sample.html](website/website_sample.html) — sample backup/alternate page
- [dashboard](dashboard)
  - [dashboard/index.html](dashboard/index.html) — analytics dashboard
  - [dashboard/dashboard.css](dashboard/dashboard.css) — dashboard styling

## GitHub Pages deployment

This project is designed for a single GitHub Pages repo using folder-based URLs.

After publishing from the repo root, these are the live URLs:

- Website: https://your-username.github.io/your-repo/website/
- Redirect test: https://your-username.github.io/your-repo/website/redirect-test.html
- Dashboard: https://your-username.github.io/your-repo/dashboard/

## Important limitation

GitHub Pages can host multiple folders under one repo, but it cannot host two completely separate root websites from a single repository.

So this repo supports:

- one website folder
- one dashboard folder
- one GitHub Pages domain with subfolder paths

It does not support:

- two independent root apps
- two separate domains from one repo
- fully independent deployments without a second repo or different hosting target

## Recommended usage

For this demo:

- keep the marketing site and redirect flow together in [website](website)
- keep the dashboard in [dashboard](dashboard)
- use GitHub Pages subfolder URLs for public access

## The two website experiences in this repo

### 1) Marketing website
The main website is a TMatch-inspired landing page for a therapist matching experience. It includes:

- hero section and CTA buttons
- therapist profile cards
- sections for how it works, why TMatch, and FAQ
- redirect flow to test landing page performance

This site is designed to simulate a real marketing funnel and show how visitors move through a site.

### 2) Redirect landing test page
The redirect test page simulates a user arriving from a campaign or source and then reviewing therapist profiles. It includes:

- landing visit counts
- source-based tracking
- therapist cards
- Book appointment buttons
- conversion-like events for booking actions

This is the test page used to validate that a visitor lands, explores options, and converts.

## What this demo can track

Because this project is browser-only and stores data in localStorage, it can track things like:

- page views
- CTA clicks
- section views
- scroll depth
- outbound links clicked
- form focus and input activity
- form validation errors
- form submissions
- page exit events
- time on site
- source values such as homepage, footer, redirect, or direct
- redirect landing counts by source
- number of bookings by therapist
- clicks by source
- booking conversion metrics
- unique user IDs generated in the browser
- mouse movement events
- hover/heatmap-like interaction summaries
- date-filtered event views in the dashboard

These are useful for demoing analytics behavior and validating frontend tracking logic.

## What this demo cannot track reliably

This repo does not have a real backend or database, so it cannot accurately track the following in a production sense:

- true user identities across devices or browsers
- a real conversion funnel from multiple sessions and platforms
- purchase or booking data tied to a secure CRM or payment system
- backend analytics pipelines or event ingestion streams
- real-time cohort analysis across many users
- true GDPR/PII-safe user profiles
- cross-domain attribution across unrelated websites
- trustworthy marketing attribution without server-side data collection
- production-ready heatmaps with session replay and aggregated behavior data
- actual revenue, bookings, or pipeline conversion from a business system

In other words, the dashboard is a frontend prototype, not a production analytics product.

## Notes

- All links in the website are relative, so the redirect test stays working as part of the same site experience.
- The dashboard reads from browser localStorage and stays separate from the marketing page logic.
- This is a front-end demo for analytics tracking, not a production backend analytics pipeline.
