# Rules Wiki authoring agreements

These instructions apply to this directory and its descendants. Communicate with the user in Chinese; keep agent instructions in English. Read [README.md](README.md) for navigation and build conventions.

## Design authority

- The user's explicit, confirmed decisions are the golden source for this rulebook. When they conflict with historical Rulebooks, developer documentation or current implementation, follow the confirmed user decision. A newer explicit correction supersedes the older decision on that point; silence does not approve a proposal.
- Before drafting a chapter, read its existing rules, linked definitions, [confirmed decisions and sources](maintenance/sources.md), [change history](maintenance/versions.md) and relevant [open questions](maintenance/pending.md). Do not revive a superseded mechanic from historical material.
- Old documents supply missing context. Inspect unified's actually pinned implementation read-only when needed to explain ambiguities; distinguish historical design, implemented behavior and proposed rules. Implementation is evidence, not design authority.
- Keep concrete gameplay definitions in their owning Wiki pages, not in this instruction file. Update confirmed clauses, dependent links and decision records together. Distinguish confirmation of an outline, individual clauses and an entire chapter; retain draft status until the corresponding review is complete.
- This source-authority policy is an authoring agreement, not a hierarchy between in-game modes, cards, keywords or effects. In-game exceptions follow chapter 1.

## Structure and explanation

- Write game rules, not programming architecture. Explain timing, choices, legality, costs, cancellation, state changes and follow-up effects precisely enough to reproduce play from the initial state, choices and random outcomes.
- Number every subsection in the twelve chapters hierarchically (2.1, 2.2.1). Preserve stable page IDs and semantic anchors when renumbering; repair references when relocating content.
- Use Markdown Mermaid `flowchart` fences for processes, state transitions and operation windows when they clarify the rule. Keep diagram source in the owning Markdown file; do not hand-author SVG flowcharts. Spatial illustrations such as board geometry may use SVG. Explain diagram scope and ensure arrows do not imply ungranted permissions.
- Treat minion, spell and resource cards as peer types. Cover the same lifecycle fields for each: generation, coexistence, benefits/effects, persistence, leaving play and deck circulation. Do not elaborate only the most recently discussed type.
- Give each rule one canonical home and link to it elsewhere. Keep placement examples under placement, movement under movement, operation-window definitions in chapter 4, and keywords in the keyword library. Record cross-cutting resolution order in chapter 7.
- Describe card definitions separately from instance attributes and counters. Use precise control terminology: uncontrolled cards/monsters are not a card profession. Define pickup eligibility by player control; do not add redundant profession-specific exceptions.
- Record the final rule directly. Keep historical implementation restrictions, abandoned proposals and source disagreements in maintenance notes rather than repeatedly qualifying gameplay prose.
- If a missing detail can change an outcome, state a concrete question and example for review. Do not silently invent a rule or leave a generic "needs clarification" marker. Identify editorial assumptions explicitly.

## Review and delivery

- Draft and submit one chapter at a time unless the user explicitly requests a batch. Apply confirmed corrections across affected chapters without asking for the same approval again.
- This task authorizes website Wiki/content-rendering changes; other game repositories are reference-only unless the user explicitly expands scope. Updating the rulebook does not authorize gameplay or card-data migration.
- Edit Markdown sources and regenerate `wiki-data.js` with `npm run build:wiki`; run `npm run test:wiki` and `git diff --check`. Check browser rendering for changed diagrams or presentation behavior. Do not hand-edit generated data.
- Continue the existing Issue/PR and project workflow; do not create duplicate tasks or merge/deploy without authorization.
