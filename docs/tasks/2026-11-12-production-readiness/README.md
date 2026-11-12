# Production readiness audit

## Intent and acceptance

Audit the existing dirty prototype without publishing or replacing user work. Use the pinned production-readiness skill (7f3b205), preserve its first audit and refresh after repairs. Verify build, static checks, unit and browser journeys, recovery, accessibility and synthetic-data boundaries. Deliver the Polish offline checklist at ../../production-readiness.html. Existing visual direction is preserved; no redesign is in scope.

## Initial findings

- Default Node 25 conflicts with the reference kit's Node 24 gate.
- Lint: profile card synchronization omits a dependency.
- Two storage tests fail: reading current data adds fields to non-candidate personas.
- Migration also enriches submitted snapshots from current fixtures, conflicting with snapshot immutability.

## Repair scope

Restrict legacy migration to version 1; preserve snapshot content, including absent optional context; synchronize profile cards with stored cards. Add migration regression tests and exercise the current browser suite. Do not change role security, hosting, data policies or install global tools.

## Review and remaining limits

Separate review confirmed that version-2 input is no longer enriched, legacy submitted cards remain exact, full 20-card profiles do not overflow the schema limit, and current user styling is preserved. A real tablet navigation overflow was repaired using the existing compact-header pattern below 1024px. The new browser test uses a named panel to avoid selecting a transitioning outgoing tab.

The initial audit found three style expectations requiring reconciliation of the fork's dark design with the upstream light Poster People contract. Do not delete assertions simply to turn the gate green. Full operational readiness is not claimed. The dependency scan found 0 runtime vulnerabilities and 12 development dependency findings (10 moderate, 2 low; minimatch and deepmerge chains). No automatic major downgrade or dependency override was applied. These are tooling risks, not evidence of an exploitable shipped static endpoint.

Build output is approximately 640 kB JS (210 kB gzip), 124 kB CSS and a 1.51 MB illustration. No real-device/network performance budget or production load/cost evidence exists. No real authentication, live AI, cross-device state, production telemetry or multi-tab concurrency is promised. The Vercel configuration, owner access, rollback target and actual hosted smoke remain unverified. See release-plan.md and the generated checklist for evidence and next steps.

## Follow-up: accepted fork style

The project-level log of 2026-11-08 and skills/doroboty-tech-human/SKILL.md establish the accepted navy fork style. On explicit follow-up, the two obsolete light background assertions now check #080e1b, and homepage surface assertions check the documented 10px radius/#26354c contour. Navigation, persistence, typography, accessibility and responsive assertions remain in place. The immutable upstream kit is unchanged. The task's user-authorized fork style takes precedence over upstream theme adoption instructions for this audit.

## Dependency impact review

`npm audit fix --dry-run --ignore-scripts` proposed 13 patch updates but still reported 12 findings; no dependency mutation was applied. The moderate chain is minimatch -> @ts-morph/common -> ts-morph -> shadcn, and minimatch -> @typescript-eslint/typescript-estree -> parser/utils/type-utils/eslint-plugin -> typescript-eslint. The low chain is deepmerge -> @shadcn/registry -> shadcn. Glob amplification can consume CPU/memory in development tooling; prototype poisoning affects merged CLI configuration from untrusted inputs. Neither chain ships as runtime JS. Avoid untrusted registry/config input; track compatible upstream fixes. A forced shadcn downgrade to 1.0.0 would be a major change and is not a safe mechanical repair. Runtime audit: zero findings.

## Checklist classification

Authentication, payments, backend, provider AI, server persistence and production database backups are inapplicable to this synthetic frontend. Production URL/HTTPS, actual Vercel configuration, deployed logging/alerts and real-use observation are future-stage checks. The pinned schema fixes baseline stage assignments: rollback planning, smoke ownership, expected capacity, incident ownership, recovery planning and prepared observability remain preparation requirements. They cannot be relabelled as deployment checks to inflate readiness; their actual hosting verification is separate. Unknown operational facts remain explicit, not code defects.

## Final executed gate

`PLAYWRIGHT_BROWSERS_PATH=/tmp/doroboty-playwright PATH=/tmp/node-v24.22.3-darwin-arm64/bin:$PATH ./scripts/verify` exited 0: formatting, immutable kit (67 files and 6 tests), ESLint, TypeScript, 31 unit tests, baseline packet, Vite build and all 35 Chromium journeys passed. Evidence: artifacts/readiness/verify.log. No deployment was performed. Offline checklist validation and browser checks are separate from application tests.
