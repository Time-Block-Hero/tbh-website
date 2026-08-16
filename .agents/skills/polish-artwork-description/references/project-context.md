# Project context routing

Work from the repository root.

- `data/cards.json`: authoritative editor schema and current card fields.
- `formal_card_ref.json`: authoritative latest card roster, IDs, mechanics, parent/derivative relationships, tags, and factions.
- `app.js`: website world bible, factions, timeline, and character material. Search for the current faction, character, and `WORLD_BIBLE_MD_ZH`; do not load unrelated sections.
- `references/species-art-direction.md`: authoritative visual and lore rules for the project's original lifeforms. Read the matching species section whenever a card name, tribe, or brief involves that lifeform.
- `ReferenceDocs/TBH基础设定-1.docx`: deeper setting reference when the website material is insufficient. Use the documents skill if this file must be read.
- Future expansion references: look for files whose names or contents match the card's expansion/set. If no expansion field or matching source exists, use only base-world and faction context and state that expansion context was unavailable.

Card art fields in schema version 3:

- `artDescription`: the sole artwork prompt/scene-description field.
- `artDescriptionNeedsPolish`: user-controlled queue flag. `true` means polish it; `false` means leave it unchanged unless explicitly requested.
- `artRequest`: number of additional illustrations requested. This skill does not change it.

Do not recreate the removed `flavorText`, `aiText`, or `cardImages` fields.
