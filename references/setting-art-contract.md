# Setting archive as the asset design authority

The setting archive exists to define consistent, reusable visual identities for civilizations, characters and fictional lifeforms, and later to constrain story additions. Treat approved appearance and design rules as production constraints, not optional mood-board suggestions. Unfinished content remains unfinished.

## Resolve references before generation

1. Resolve current identity and explicit artwork keys in `data/setting.json`, `data/cards.json` and `bestiary-taxonomy.js`. Never use reorderable card IDs as species identity.
2. Read the selected branch and its race-wide source dossier in `bestiary-data.js`. Race principles apply across branches only to the extent explicitly stated; do not extend one branch's anatomy or one person's costume to a whole race.
3. Read `references/species-art-direction.md` for additional approved structural invariants and allowed variation. It is a derived production reference and must remain consistent with the archive and current user decisions.
4. Read current card briefs and selected artwork for the specific individual. `bestiary-card-sources.js` is generated display data, not another authoring source.
5. Separate required identifiers, explicit prohibitions, permitted variation, individual traits and unresolved fields before writing or generating artwork. When sources conflict, identify the conflict and resolve the affected decision; do not silently choose a source or fill unknown anatomy.
6. Inspect the produced image against those constraints. A recognizable style alone does not compensate for missing species identifiers.

## Race and branch hierarchy

`bestiary-taxonomy.js` owns the six designer-requested race headings and explicit branch identities. `bestiary-data.js` retains the full existing dossier texts and images. Four former umbrella entries are used as race-level context; their contents are not competing leaf species.

- Wildlife: preserve all nine existing records. Duskbell Matriarch is a documented aged-female form; its exact lineage remains unresolved.
- Mechanical life: Angels and Sprites have separate body plans. Angel job variants and approved chassis illustrations remain within the Angel branch.
- Crystal spirits: Wandering and Oracle branches. The Orbital Crystal Spirit is a current individual reference for Wandering, not a card rename.
- Avatar kin: Deer, Fox and Elven branches. The existing Pantherkin Warrior remains an acknowledged individual whose branch awaits organization; it is not deleted or silently assigned elsewhere.
- Nebular life: Ray, Bear and Primordial Sun branches. A ray silhouette must not spread to the other branches.
- Calamity manifestations: Common, Flying, Large/Roaring and Time Lord are parallel causal expressions, not biological growth stages. This catalog label does not change their ontology.

Fox kin, Elven kin, Bear-shaped Nebula and Primordial Sun have no established branch body plans or dedicated assets in the current sources. They must not inherit another branch's image as a substitute for a missing standard.

## Approval and scope

`documented` means an existing design basis is available; it does not approve every historical image. `card-reference` identifies traits extracted from a particular card and requires a dedicated branch standard. `incomplete` is an explicit unfinished entry. Candidate images, source individuals and canonical concept sheets must be distinguished.

The current card resource rules, card names, tribes and effects remain owned by `data/cards.json`. This taxonomy is for setting and asset design; it does not rename gameplay tribes, rebuild runtime content or change card behavior.

Future story work should preserve approved civilizations, identities and lifeform constraints. Missing history or narrative relationships are not permission to invent them while filling visual asset entries.
