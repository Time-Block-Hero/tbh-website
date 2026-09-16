# Website organization validation

Date: 2026-09-16. Baseline: `cd4346f29023d288eb00490d19f31cdd42ba0fb3`.
Tracking: https://github.com/Time-Block-Hero/time-block-hero-unified/issues/41

## Automated checks

- Node.js 24.4.1; `npm ci`, `npm run build`, `npm test`: 13 tests passed.
- Wiki: 18 Markdown pages in 9 groups, all draft placeholders. Build checks page IDs, links, anchors and safe rendering.
- Dossiers: 22 identities and 4 class concepts. Tests cover reorder-safe references, identity replacement, selected artwork, missing sources and stale visitor introductions.
- `node --check` on new entry scripts and changed tools; `git diff --check` passed.
- Ran the card synchronization command in a disposable clone after deleting the old app entry. All 137 cards synchronized; the JSON mirror and generated fallbacks remained consistent.

## Browser checks

Used Playwright with installed Chrome, temporary browser profiles and the repository's local server. Checked the Chinese/English setting pages, Wiki, Chinese/English bestiary and card editor at 1440px and 390px width. No JavaScript exceptions, failed resource requests or horizontal document overflow were observed.

Verified character search, empty results, multiple forms, retained story-only placeholders, card-source disclosure, Wiki title search, mobile menu, direct routes after reload, and old editor/effect-page redirects. An intercepted identity mismatch correctly hid the old character art and flagged the source for review. Generated setting content also worked through `file://`.

Reviewed full-page desktop/mobile screenshots. Aligned the Wiki and shared header breakpoints; rechecked 390px, 700px, 710px and 720px widths.

## Editor regression in a disposable copy

All mutation checks used a separate temporary filesystem root and server port. The real design data was not used as a write target.

Passed:

- 118 collectable tiles; 137 total source cards.
- Edit an effect, save it to disk, reload and confirm persistence.
- Select another artwork variant and confirm the stored selection.
- Rename an English card name and verify directory, filenames and JSON references follow it.
- Drag a card to another position and verify renumbering.
- Switch cost/ID view sorting.
- Save a derivative after assigning a unique English name, then delete it.

### Existing editor issue

The immediate automatic save after clicking **Add derivative** fails with HTTP 400 (`duplicate artwork name`): the existing `addDerivative` copies the parent's `artworkKey`. Assigning a distinct English name and saving succeeds. Both `card-editor.js` and the server are byte-identical to the baseline, so this is a pre-existing behavior, not a change in this PR. It remains outside the organization refactor.

Reproduction: open a normal card, click the derivative `+`, and inspect the save response. Keep this check in a disposable copy because a failed save leaves an unsaved local derivative.

## Preservation and limits

Compared against the baseline and confirmed byte-identical:

- `data/cards.json`, `formal_card_ref.json`, `ReferenceDocs/cards (1).json`.
- `card-editor.js`, `card-editor-data.js`, `tools/card-editor-server.mjs`.
- `card_layout_ref/layout.json`, `styles.css`, all card artwork and templates.
- `bestiary.js`, `bestiary.css`, all creature concept assets; all 15 records retained.

Old website app scripts, obsolete story/character illustration bundles and Development Center content were removed. Four class concept images remain in use. Elaine/Weiyang's prior PNG files remain only as unpublished references; their new dossiers do not claim those images as approved assets.

Rules remain placeholders. Full background, biographies, concept sheets and chibi assets remain incomplete. Runtime-card archival, package imports, new lore, deployment and merge are not part of this change.
