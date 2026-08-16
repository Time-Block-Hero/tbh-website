---
name: polish-artwork-description
description: Polish Time-Block Hero card artwork descriptions using the game's worldbuilding, faction identity, expansion context, and card mechanics. Use when a user asks to complete, refine, rewrite, or batch-process cards whose artDescriptionNeedsPolish flag is true. Do not generate artwork or change gameplay data.
---

# Polish Artwork Description

Turn a rough `artDescription` into an image-generation-ready scene while preserving the card designer's intent.

## Workflow

1. Read `references/project-context.md` and follow its source routing.
2. Read `../references/rarity-art-direction.md` and apply its rarity-specific art direction and Legendary clarity gate.
3. Read `data/cards.json`. When the user names card IDs, limit work to those IDs. Otherwise run:

   `node tools/artwork-workflow.mjs polish-queue`

4. For each selected card, ground the description in its name, type, rarity, faction, tribes, rules, tags, parent card (for derivatives), and available expansion context.
5. For every Legendary card, apply the Legendary clarity gate even when its current description is non-empty. If identity, story beat, situation, or composition is materially ambiguous, stop on that card and run the reference's brainstorm checkpoint. Do not silently invent the missing direction.
6. Preserve every concrete detail supplied by the user. Add only details supported by project lore or clearly framed visual interpretation. Never change card rules, stats, IDs, collectability, or relationships.
7. Write one compact production prompt into `artDescription`. Describe subject, action, environment, composition, lighting, palette, atmosphere, faction-specific motifs, and the rarity-appropriate level of visual ambition. Keep it suitable for a tall card-art crop.
8. End the description with constraints equivalent to: artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons.
9. Set `artDescriptionNeedsPolish` to `false` only after the description is complete and, for a blocked Legendary card, after the user has confirmed a direction. Use a temporary UTF-8 text file and apply each result with:

   `node tools/artwork-workflow.mjs set-description CARD_ID DESCRIPTION_FILE`

10. Re-read the changed cards and report card IDs, names, rarity, and any missing lore or expansion information. Do not call image generation in this skill.

## Quality bar

- Keep the central subject recognizable at thumbnail size.
- Scale composition, narrative density, and finish by rarity without making lower-rarity art look unfinished.
- Make Legendary descriptions feel like a specific, iconic story moment rather than a generic scene with extra detail.
- Avoid generic science-fiction filler when the faction or character has established motifs.
- Treat gameplay text as narrative evidence, not literal UI to paint into the scene.
- Keep derivatives visually related to their parent while making the transformed state unmistakable.
- If lore sources conflict, prefer the newest explicit project data and flag the conflict instead of silently choosing.
