# Project contribution card prototype

## Intent and decision

Extend the candidate profile and application record with repeatable structured project contribution cards, following Supersprint decision `supersprint/week-02/07-prototype-decision.md` (need `aff-O1`, concept `i1`, experiment `e1`). Each card includes organization, role and period for context, then separates project goal, candidate actions, team actions, personal responsibility, and result. It tests whether an employer can identify an applicant's contribution without attributing team work to one person.

Research context: eight synthetic interviews (four candidates, four employers) and three CSV analyses. Interview evidence includes candidates wanting to avoid overclaiming technical work and employers struggling to infer contribution from project descriptions. CSVs show lower returning users in June despite higher Match Score; they do not establish a causal explanation or validate this card. See the cited analysis and interview synthesis under `supersprint/week-02/`.

## Prototype task

Candidate: select Anna Kowalska or Marek Nowak, review/edit existing project cards, add another card with the same fields, then submit an application using the existing local application flow. Employer: select Karolina Wiśniewska, open the resulting candidate record, and explain the projects' goals, candidate actions, team actions, stated responsibility, and results using the submitted snapshot.

The system must show the same card in the employer's application record after profile edits, alongside the existing answer/CV/history features. This is a frontend-only local prototype with synthetic fixture data. No AI generates or judges the card.

## Signal and limits

Use the existing Supersprint `e1` comparison: compare a plain-text version with the structured card using the same project facts; each employer sees only one version of a given project. Observe correctly identified facts, false attributions, omissions, time, clarifying questions, and nonresponse. A directional positive signal is fewer false attributions without losing important facts, at acceptable effort. Do not invent a numeric threshold or claim hiring, retention, or repurchase impact from this prototype.

This implementation prepares the structured-card flow; it does not run the human comparison. The prepared Match Score and summary remain scenario fixtures and are not evidence that a model evaluated this card.

## Acceptance criteria

- Candidate can add, edit, remove and preview multiple project cards on the existing profile routes, with organization, role and period context.
- All project cards are captured in an application submission snapshot and shown to employer in the application record.
- Existing application answer, CV, stage history and applicant/employer role boundaries continue to work.
- Existing saved data without a card remains readable; the card is optional for legacy records.
- Polish UI follows the prepared `doroboty-tech-human` skill and the deployed DoRoboty.ai landing: navy canvas, restrained blue accents, Helvetica Neue, compact 10px cards and consistent controls.
- `./scripts/verify` and a manual multi-screen desktop review are recorded with actual outcomes.
- Capture at least one screenshot of the completed employer record for the Circle post and quest submission.

## Local walkthrough

Manually selected Marek, saved his profile, confirmed the profile preview rendered all five fields, submitted the existing local BrightLabs application with the existing answer/consent flow, switched to Karolina, and opened the new Project tab in the application record. The existing Answer tab, CV tab, Match Score, stage history and recruiter actions remained present. Edited the candidate profile after submission and reopened the employer record: its Project tab kept the original submitted card; then restored the original local fixture text. This is one browser scenario with synthetic data, not a human experiment.

A Playwright browser binary was not provisioned, so automated browser journeys could not execute. No browser or OS dependencies were installed. The local screen was manually opened and reviewed in the in-app browser.

After review, the profile editor, public application confirmation and employer Project tab were aligned to `doroboty-tech-human`. The manual visual review confirmed dark shared navigation and surfaces, accessible input contrast, the structured card treatment, and consistent active tabs/status badges. On 2026-11-08, Anna's synthetic example was populated from her sample CV and the profile hierarchy strengthened. The profile now supports repeatable project cards grouped by organization/role/period; submitted applications retain a snapshot of the full project list. Existing stored single-card profiles and submitted records are migrated without replacing edited content. Typecheck, Prettier and `git diff --check` passed. In the browser, the legacy Anna profile loaded with company/role/period context and a second blank project section appeared with all expected fields after clicking “Dodaj projekt”. The second card was not saved and the recruiter snapshot flow for multiple cards was not manually traversed in that turn. The demo fixtures were then expanded: Anna and Marek each have two different project cards; the interface labels the sample data and simulated details.
