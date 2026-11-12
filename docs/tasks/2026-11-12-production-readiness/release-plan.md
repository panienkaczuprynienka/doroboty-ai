# Vercel release and recovery plan

This is a plan only. No deployment, account access, production configuration or rollback was verified. Publish only the synthetic teaching prototype. Role selection is not authentication; AI and Match Score are prepared simulations. Use one editing tab; browser state is not shared by URL.

## Build

Use the application folder as Vercel Root Directory (relative to the connected repository, not an absolute machine path). Framework: Vite. Install: npm ci. Build: npm run build. Output: dist. Node: 24.x. No application environment variables, API keys, database or functions are required. HashRouter does not require SPA path rewrites. Do not publish the vault, source history or docs/source.

Run ./scripts/verify under Node 24 with provisioned Playwright Chromium before releasing. Record the source fingerprint and deployment ID. Actual account settings, access policy, bandwidth budget and audience size still need confirmation.

## Post-deployment smoke

The person publishing must perform these steps on the exact HTTPS deployment URL in a clean browser context, using synthetic data:

1. Open home, offers and a copied hash offer URL; reload it. Confirm fonts, logos and both PDF CV downloads load.
2. Select Anna, edit three project cards, save and reload; apply to an offer.
3. Change the profile afterward. Switch to Karolina and confirm the submitted project snapshot is unchanged. Record a recruiting decision and reload.
4. Export a scenario, import into another clean browser context, verify cards and decision; test an invalid import without losing state.
5. Check 390px and keyboard navigation, console errors, unexpected external requests and host access policy.
6. Stop sharing or roll back if submission, persistence, snapshots, assets or data boundaries fail. Never reset someone else's browser storage to hide an error.

## Recovery

Export local JSON before reset, version change or changing domains. Origin changes create a separate browser store. An older app may reject version-2 data: preserve the original export; restore the matching app version or explicitly reset only the synthetic scenario after saving a copy. Source rollback does not roll back localStorage.

Vercel documents Instant Rollback, but the target project's previous good deployment and permissions have not been established. The publisher must identify a known-good deployment and verify rollback availability before relying on it. With no known-good deployment, temporarily withdraw the shared link and repair/redeploy instead of promising instant recovery.

For an incident, record URL, time, browser, steps and a redacted screenshot; never collect real CVs, free text or full scenario exports from strangers. The response owner, contact channel, alert recipient and hosting limits remain unconfirmed. Local tests do not establish deployed observability.

## Primary references checked 2026-11-12

- https://vercel.com/docs/frameworks/frontend/vite
- https://vercel.com/docs/instant-rollback
