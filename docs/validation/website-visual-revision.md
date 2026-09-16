# Same-page archive and editor-theme validation

Date: 2026-09-16. Revision baseline: `557fb76`.
Task: https://github.com/Time-Block-Hero/time-block-hero-unified/issues/41
PR: https://github.com/Time-Block-Hero/tbh-website/pull/2

## Scope and preserved inputs

The setting homepage now contains four independent native disclosures. Civilization tiles open an inline dossier and can reveal related characters on the same page. The cosmic bestiary is completely restyled and embedded into the fourth disclosure; old standalone URLs redirect into that archive.

The editor uses a separate theme stylesheet for workspace surfaces and controls. Its DOM IDs, named controls, card renderer, save server, data, card artwork, template assets and layout JSON remain unchanged. The title is now “卡牌设计工作台”.

All 15 creature records moved from `bestiary.js` to `bestiary-data.js`. Per-record SHA-256 tests confirm equality of every original field, including known forms, handling protocols, specimen references and both languages. Creature artwork files remain untouched.

## Verification

- `npm run build`, `npm test`: **16 tests passed**.
- Syntax checks on new/changed scripts and `git diff --check` passed.
- Compared protected editor/data/layout/artwork files against `557fb76`: no changes.
- Editor theme test: fixed-size 300×480 card render, identical background, theme enabled/disabled: PNG captures were byte-identical.

### Browser behavior

Playwright with temporary Chrome profiles; main integration preview at port 4328.

For both Chinese and English homepages at **1440px and 390px**:

- Open and close each of the four disclosures by mouse and keyboard.
- Directory links reveal the requested section.
- Expand/collapse each civilization dossier and open Vera's character entry in place.
- Character search remains intact after collapsing and reopening its section.
- Select all 15 creature records without navigating away from the homepage.
- Search, empty results, classification filtering and selection state work.
- Open a full-image dialog, close with Escape, and retain the selected creature after collapsing/reopening.
- Reload a creature deep link and open the correct section/entry.
- Select a character after visiting a different section; its shared URL and reload open the character section rather than retaining the previous hash.
- Legacy Chinese/English bestiary URLs retain valid creature IDs.
- No JavaScript errors, failed asset requests or horizontal document overflow observed.

Reviewed desktop/mobile viewport screenshots for the civilization selector, bestiary and editor list/detail/artwork controls. Mobile editor fields scroll to a visible action bar.

### Isolated editor writes

Used a fresh disposable copy at port 4330, not the source checkout. Verified 118 collectable cards / 137 total cards, save/reload, alternate selected artwork, English-name artwork-directory renaming, drag renumbering, view sorting, and derivative save/delete after assigning a unique English name. The existing initial derivative auto-save error remains as recorded in the initial validation; editor logic was not changed.

## Explicit unfinished content and inherited gap

Civilization history, institutions, class roles and mechanics remain labeled unfinished. No gameplay rules or new lore were authored.

The original Puru Beast specimen references `./assets/card-art/rampaging-puru-beast/rampaging-puru-beast-01.png`, which was already absent in the baseline. The record is preserved and the UI displays an unfinished-image placeholder without requesting that missing file. No other missing creature images are allowed by the asset test. Other dossiers retain their existing incomplete concept/chibi slots.

No merge or deployment was performed.
