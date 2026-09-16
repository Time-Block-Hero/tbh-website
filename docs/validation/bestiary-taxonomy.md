# Bestiary race hierarchy validation

Date: 2026-09-16. Repository: `tbh-website`; branch: `codex/website-structure`.
Scope: user-requested refinement of unified Issue 41 / website PR 2.

## Delivered behavior

- Six collapsible race parents contain 23 branch entries. Former umbrella dossiers supply parent-level principles; Angel role variants remain within Angels, and four Hollow-Null forms are separate parallel branches.
- Detail views distinguish inherited principles, branch identifiers, prohibitions, allowed variation, unresolved decisions, individual illustrations, concept sheets and future chibi assets.
- Fox kin, Elven kin, Bear-shaped Nebula and Primordial Sun remain explicitly incomplete. No new canonical anatomy or imagery was generated. The existing Pantherkin individual is acknowledged as awaiting branch organization.
- Current card references resolve by stable artwork key and selected artwork. Reviewed source hashes flag changed card briefs instead of silently treating stale excerpts as asset standards.
- Existing artwork workflows now read the setting production contract before generating or polishing descriptions.

## Automated checks

- `npm run build`: Wiki, character archive and six bestiary card references generated successfully.
- `npm test`: 21 passing tests. Coverage includes exact fingerprints of all 15 original source dossiers, complete taxonomy source coverage, distinct calamity forms, intentionally empty branches, card identity/brief/art selection, legacy routes and existing character/Wiki regressions.
- JavaScript syntax checks and `git diff --check` passed.
- `bestiary-data.js`, card JSON, editor logic, card renderer/layouts and artwork were not modified by this refinement.

## Browser checks

Codex in-app browser against the isolated preview at port 4328:

- Chinese and English race/branch navigation; direct flying-form link and legacy `crystal-spirit` URL resolving to the Crystal race overview.
- Native race disclosures expand/collapse with keyboard; parent overview and child selection render the corresponding content.
- Angel source notes and eight role examples remain visible within their branch; Fox displays incomplete design/art positions; Flying Hollow-Null and Oracle display their distinct references.
- Search for Angels and Time Lord, no-result query, and keyboard clearing back to all 23 branches. Time Lord search returns one branch rather than every calamity sibling.
- Concept image dialog opens and Escape closes it.
- Desktop screenshot and 390 × 844 mobile screenshot inspected. No horizontal overflow; mobile selection brings the detail into view. Viewport override reset afterward.
- Sampled English detail has no broken rendered images or warning/error console entries.

This was targeted interaction/visual QA, not an exhaustive browser pass over every branch. All branch identities and source preservation are covered by automated checks. Earlier editor mutation and fixed-size rendering checks remain recorded in `website-visual-revision.md`; editor behavior did not change in this refinement.

## Remaining content work

Dedicated branch standards, missing concept sheets, chibi assets and pending lore need author review/filling. `documented` denotes an existing design basis, not blanket approval of every historical image. The inherited missing Puru specimen remains an explicit placeholder. Manual acceptance, merge and deployment remain with the user.
