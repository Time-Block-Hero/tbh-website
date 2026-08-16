---
name: artwork-generation
description: Generate Time-Block Hero card illustrations from data/cards.json art requests in the project's default Industrial Sci-Fi Anime style, using $artifact-template-industrial-sci-fi-anime and $imagegen, then save and register every result as a card artwork variant. Use for one-card or batch card-art generation. Do not render card frames or overwrite the user's selected official artwork.
---

# Artwork Generation

Fulfill each positive `artRequest` count with separate image variants and make the results immediately available in the card editor.

## Required skills

Read and follow the bundled `$imagegen` skill, then read and follow `$artifact-template-industrial-sci-fi-anime` before generating any image. Apply that template and its retained PNG reference to every generated variant unless the user explicitly requests a different style for the current task. Treat the retained image as a style reference only; keep card content, composition, and crop requirements authoritative. If the template or its retained reference is unavailable, report the missing dependency instead of silently substituting a generic anime style.

If a queued card has `artDescriptionNeedsPolish: true`, use `$polish-artwork-description` on that card before generation.

## Workflow

1. Read `references/artwork-pipeline.md`.
2. Read `../references/rarity-art-direction.md`. Use rarity to scale composition, narrative density, and finish while keeping the same output resolution and baseline production quality.
3. From the repository root, list the generation queue:

   `node tools/artwork-workflow.mjs request-queue`

4. Validate that each queued card has a non-empty polished `artDescription`. Do not generate from blank or still-flagged descriptions.
5. Apply the Legendary clarity gate to every queued Legendary card regardless of `artDescriptionNeedsPolish`. If the description leaves a defining identity, story beat, situation, or composition decision ambiguous, do not generate that card. Use `$polish-artwork-description` to present a brainstorm checkpoint and wait for user confirmation.
6. Generate exactly `artRequest` independent images for each unblocked card through `$artifact-template-industrial-sci-fi-anime`, which invokes `$imagegen` with its retained PNG as the style reference. Use one image-generation call per requested variant. Preserve the card's `artDescription`; add the template's style language, production constraints, and rarity direction from the references. Do not inherit the retained reference's characters, branded details, composition, or aspect ratio.
7. Require a unique, non-empty English card name. Convert it to a lowercase kebab-case artwork key, for example `Power Plant` → `power-plant`. Save each finished raster as `assets/card-art/ARTWORK_KEY/ARTWORK_KEY-xx.png`, such as `assets/card-art/power-plant/power-plant-01.png`. Choose the next unused two-digit sequence and never overwrite an existing variant. Card ordering IDs must not appear in artwork filenames.
8. Immediately after each successful file, register it:

   `node tools/artwork-workflow.mjs register CARD_ID IMAGE_PATH`

   Registration appends the variant, selects it only when the card has no prior official artwork, decrements `artRequest` by one, and rebuilds the direct-file fallback. This makes partial batches resumable.
9. Verify that `data/cards.json`, `card-editor-data.js`, and every registered image path agree. Report successes, blocked Legendary cards, and remaining request counts. Do not assemble frames, labels, stats, or UI into the generated image.

## Parallel generation

When the user requests parallel generation and subagents are available, partition work by whole card IDs across at most three generation workers. Each worker may generate and save images only into distinct English-name artwork-key directories. Workers must not edit `data/cards.json` or `card-editor-data.js`; the coordinator registers completed images serially with `tools/artwork-workflow.mjs` after all workers return. This prevents shared-JSON races while retaining parallel image generation.

If parallel workers are unavailable, process the queue serially. Never duplicate requests merely to fill worker capacity.
