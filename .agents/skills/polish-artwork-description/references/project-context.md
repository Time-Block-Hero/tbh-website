# Project context routing

Work from the repository root.

- `data/cards.json`: authoritative editor schema and current card fields.
- `formal_card_ref.json`: generated runtime reference; it must not override current website designs.
- `data/setting.json` and `setting-data.js`: current dossier identity mapping and derived card descriptions. Full biographies and background are unfinished; do not restore retired website lore or invent canon to fill placeholders.
- `references/species-art-direction.md`: authoritative visual and lore rules for the project's original lifeforms. Read the matching species section whenever a card name, tribe, or brief involves that lifeform.
- `ReferenceDocs/TBH基础设定-1.docx`: historical setting reference requiring reconciliation with current designer decisions; it is not automatically approved canon. Use the documents skill if this file must be read.
- Future expansion references: look for files whose names or contents match the card's expansion/set. If no expansion field or matching source exists, use only base-world and faction context and state that expansion context was unavailable.

Card art fields in schema version 3:

- `artDescription`: the sole artwork prompt/scene-description field.
- `artDescriptionNeedsPolish`: user-controlled queue flag. `true` means polish it; `false` means leave it unchanged unless explicitly requested.
- `artRequest`: number of additional illustrations requested. This skill does not change it.

Do not recreate the removed `flavorText`, `aiText`, or `cardImages` fields.
