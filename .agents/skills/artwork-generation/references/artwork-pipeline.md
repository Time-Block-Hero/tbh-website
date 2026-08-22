# Artwork pipeline

## Inputs and ownership

- `data/cards.json` is the authoritative queue and artwork manifest.
- `artRequest` is the number of additional images still requested, not the desired lifetime total.
- `artDescription` is the complete scene prompt.
- `artDescriptionNeedsPolish` must be `false` before generation.
- `artworkVariants[CARD_ID]` contains `{ id, src }` entries.
- `selectedArtworkIds[CARD_ID]` identifies the official image shown in card renders.
- `artworkKey` is derived once from the card's unique English name and remains stable when ordering changes the card ID.

Do not restore legacy `flavorText`, `aiText`, or `cardImages` fields.

## Image requirements

- Generate a standalone raster illustration for a Time-Block Hero card.
- Read `../../references/rarity-art-direction.md` and scale compositional ambition, narrative density, and finish according to the card's rarity. Keep output resolution and baseline production quality consistent across rarities.
- Use portrait composition near 5:8 (for example 1000 × 1600), with the main subject readable after board-view square cropping.
- Keep important faces, silhouettes, and actions away from extreme edges.
- Keep the decisive subject or action in the upper square region. For minions, characters, and creatures, emphasize one immediately recognizable primary subject. For spells, tactics, and events, emphasize a readable transformation, interaction, or process rather than turning the scene into a static character portrait.
- Produce artwork only: no readable text, logos, watermarks, card frame, decorative border, arrows, cost icon, stat icons, effect box, or other UI.
- Do not create the final composite card; the webpage applies layout layers from `card_layout_ref/layout.json`.

Legendary cards must pass the shared reference's clarity gate before generation. A non-empty prompt is not sufficient when its defining identity, story beat, situation, or composition remains ambiguous.

## Default style bridge

- Use `$artifact-template-industrial-sci-fi-anime` for every generated card-art variant unless the user explicitly requests a different style for the current task.
- Let that template resolve its retained PNG through its own `artifact-template.json`; never copy, edit, or hardcode the retained reference path into project data.
- Pass the retained PNG to `$imagegen` as a style reference and pass the card's polished `artDescription` as the content brief.
- Preserve the template's premium industrial sci-fi anime rendering language: crisp anime silhouettes, hybrid cel-and-painterly surfaces, engineered materials, restrained accent colors, and cinematic atmosphere.
- Use the reference only for rendering and design language. Do not reproduce its characters, equipment, logos, glyphs, branded details, or landscape composition.
- Let card identity, type, mechanics, worldbuilding, portrait ratio, and square-crop safety override conflicting details from the style reference.

## Style acceptance gate

Every generated image must read immediately as both **anime illustration** and **science fiction** before it can be registered or selected.

- Anime evidence must remain visible even on object, landscape, spell, and creature cards: authored contour lines or crisp silhouette edges, deliberate cel-shaped value groups, simplified designed highlight shapes, controlled color blocking, and painterly rather than photographic atmosphere.
- Science-fiction evidence must be specific and functional: engineered ceramic, composite, metal, energy, architecture, mechanisms, or faction technology with believable construction and material logic. Decorative glow by itself is not enough.
- Reject photoreal macro photography, photographic depth-of-field or lens bokeh as the dominant look, physically based product visualization, generic glossy 3D rendering, live-action realism, generic medieval fantasy painting, generic western cartoon rendering, and cute chibi styling.
- Realistic texture may support a material, but it may never erase the illustrated anime design language. When material realism and style clarity conflict, preserve the anime illustration first.
- A correct subject in the wrong style is a failed output. Do not register or select it; regenerate with explicit linework, cel-shading, designed highlights, and industrial sci-fi constraints.

## Parent and derivative artwork

- A parent card's selected artwork may be used as a reference for character identity, canonical equipment, proportions, materials, and color language.
- A derivative card must depict a distinct story beat with a clearly different camera angle, pose or action, environment, silhouette, and focal hierarchy from its parent artwork.
- Never produce a near-duplicate of the parent's composition, even when the derivative represents the same signature character or ability. Identity consistency does not mean reusing the parent's framing, flight path, gesture, or background arrangement.
- When prompting a derivative, state both the identity details that must remain and the compositional elements from the parent that must not be repeated.

## Registration behavior

`node tools/artwork-workflow.mjs register CARD_ID IMAGE_PATH` requires a unique English name, derives or reuses its lowercase kebab-case `artworkKey`, copies the image to `assets/card-art/ARTWORK_KEY/ARTWORK_KEY-xx.ext`, records that stable variant ID and relative path, selects the first-ever variant for a card, decrements its remaining request count, and rebuilds `card-editor-data.js`.

If generation stops partway through, leave the remaining `artRequest` value intact. A later run should resume only that remaining count.
