# Rarity-based art direction

Use rarity to scale compositional ambition, narrative density, and finish. Keep every rarity production-ready at the same output resolution and in the same Industrial Sci-Fi Anime style. Lower rarity means a clearer, more economical visual idea—not visibly poor workmanship.

Rarity never overrides card type. Minions, characters, and creatures still need a recognizable primary subject; spells, tactics, and events still need a readable action, transformation, or process.

## Direction by rarity

- **Common**: one clean visual idea, strong silhouette or action, restrained environment, few secondary props, straightforward readable staging, and polished but economical surface detail.
- **Rare**: a more specific setting, meaningful secondary motifs, stronger pose or action, richer material contrast, and modest foreground/background depth.
- **Epic**: layered environmental storytelling, dramatic lighting, more ambitious perspective, stronger depth and motion, distinctive faction motifs, and high material/detail density without clutter.
- **Legendary**: a singular story-defining moment or iconic character statement. Use unmistakable identity, emotionally charged action or stillness, bold perspective or framing, intentional asymmetry and depth, cinematic light, symbolic environmental storytelling, and exceptional material finish. The result should feel authored rather than merely busier.

Keep the decisive subject, face, gesture, and story beat readable inside the upper square crop at every rarity. For Epic and Legendary cards, place additional narrative layers primarily in depth, lighting, silhouette relationships, and the lower portrait extension rather than crowding the crop-safe focal area.

## Legendary clarity gate

Before finalizing a Legendary `artDescription` or generating its artwork, confirm that the available brief makes all four decisions clear:

1. **Identity**: who or what is iconic, including defining silhouette, clothing, equipment, anatomy, or other identity-bearing traits.
2. **Story beat**: the unique action, decision, revelation, confrontation, transformation, or charged still moment being depicted.
3. **Situation**: where it happens, what pressure or conflict is present, and which world/faction details make the moment specific to this card.
4. **Composition**: shot scale and angle, focal hierarchy, dominant gesture or visual line, and how the upper square crop preserves the subject and story beat.

Lore may fill minor production details, but do not invent a Legendary card's defining appearance, canonical event, relationship, or central visual metaphor. If any missing decision could materially change the character, story, or composition, pause before polishing or generation.

When pausing:

1. Summarize the established facts in a few lines.
2. Name the unresolved creative decision(s).
3. Offer two or three genuinely distinct art-direction options. Each option should specify the story beat, composition, and emotional tone—not just palette variations.
4. Ask the user to choose, combine, or revise the options.
5. Do not finalize `artDescription`, clear `artDescriptionNeedsPolish`, or call image generation until the user confirms a direction.

For batches, group all blocked Legendary cards into one concise brainstorm checkpoint when practical. Non-blocked cards may continue if doing so will not obscure the pending decision.
