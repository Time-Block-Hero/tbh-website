# Dossier authoring contract

The setting site has three sources with different responsibilities:

- `data/cards.json` owns current card names, classes, effects, art descriptions, and selected artwork. Never copy an old character biography over this source.
- `data/setting.json` owns stable character dossier IDs, explicit card identity mappings, retained story-only identities, four class concept records, and unfinished background status.
- `data/character-summaries.json` owns short bilingual visitor introductions extracted from current card briefs. `sourceDesignHash` is SHA-256 of the JSON array of `{artworkKey, name, artDescription}` for its ordered sources. A changed source hides the introduction until reviewed and re-fingerprinted; do not refresh a hash without reviewing its text. Full original briefs stay inside the source disclosure.
- `bestiary.js` owns the existing 15 creature and boundary-entity records. The character migration does not rewrite or remove these records.

Run `node tools/build-setting-data.mjs` after card changes or setting-map changes. It generates `setting-data.js` for static/offline display, including names, all mapped forms, the current selected artwork, and art descriptions. Do not hand-edit the generated file. The website should also resolve these mappings against current card data when available, so editor changes can be reflected without maintaining a second card database.

## Identity and incomplete content

Character URLs use `id`, a stable dossier slug. `sourceArtworkKeys` explicitly selects card identities; its first entry is the primary form. Resolve these keys before looking up the card's current numeric ID and artwork selection. Numeric IDs are reorderable and are never identity keys. `identityNameIncludes` is a guard against an existing artwork key being repurposed for an unrelated character.

An editor rename may change the artwork key. Update the explicit map as part of that rename; never guess by the old numeric ID. A missing, duplicated, or conflicting mapping must become a visible unresolved item during interactive browsing and fail a production build. When an entire identity is replaced, create a new dossier ID after designer review.

Only Elaine and Weiyang currently have explicit story-only retention. Their names are retained; biographies and new artwork remain incomplete. Prior character illustrations are not silently promoted into current designs. Existing faction illustrations are concept drafts awaiting review, not proof that their former histories remain canon.

Use `null` for unavailable assets and text, and `incomplete` for unfinished required fields. Never display an invented quote, relationship, historical event, or origin to fill space. Optional illustration slots do not block a dossier from eventually being complete. Source art descriptions may provide visual facts; camera/lens/rendering instructions belong in art production notes, not biographies.

## Working with AI

1. State the target dossier and the facts, source cards, reference images, and creative freedom you approve.
2. Ask the AI to resolve the current sources, list conflicts and missing fields, and draft using the appropriate template here.
3. Confirm new lore and identity decisions in conversation. The AI records those decisions and the source revision; tentative ideas remain drafts.
4. Prepare art from the approved identity and current card references. Register candidates without replacing a selected image automatically.
5. Verify identity maps, image references, layout, and editor behavior; review changes as a PR.

Example: “Update Vera from the current Titan Maiden Vera card. Keep the current selected art as the cover. Extract established appearance and equipment only; leave biography and relationships incomplete. Prepare a concept-sheet checklist and reserve the chibi slot.”

The templates below describe the intended full entry format. This initial site only implements the source-linked identity, artwork, and explicit missing slots; it does not claim that the full lore dossiers have been written.

- [Character entry](character.md)
- [Creature entry](creature.md)
