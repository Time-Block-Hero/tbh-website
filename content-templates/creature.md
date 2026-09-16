# Creature and boundary-entity dossier template

The existing `bestiary-data.js` content remains authoritative for the preserved entries. Adapt future entries to this template without discarding current ecological, morphological, or handling detail.

## Identity

| Field | Required content |
| --- | --- |
| Stable ID | Permanent species/entity slug |
| Name and aliases | Approved common name and alternative names |
| Classification | Organism, mechanical construct, crystal entity, boundary phenomenon, or approved category |
| Source links | Existing bestiary record, cards/artwork keys, approved references and revision |
| Status | Draft, confirmed, or incomplete, with unresolved claims identified |

## Text sections

- **Recognition:** silhouette, size/scale, anatomy or structure, materials, colors, distinctive signatures.
- **Habitat / occurrence:** only established locations and conditions.
- **Behavior / operation:** ecology and behavior for living species; operating behavior for constructs or phenomena.
- **Abilities and limits:** observed or approved abilities, constraints, and uncertainties; keep gameplay effects linked separately.
- **Life cycle / origin:** reproduction and development when applicable; manufacturing/origin/activation for other categories. Mark unknowns; do not force biological fields onto machines.
- **Forms and variants:** relationships among stages or forms and their visual differences.
- **Interaction / handling:** the existing bestiary's relevant observation, containment, coexistence, or handling information, with source and confirmation status.
- **Associated cards:** current identity mappings and links, including derivative forms.
- **Production notes:** unresolved anatomy, scale, art needs, and approved creative room.

## Asset slots

| Slot | Count | Specification |
| --- | --- | --- |
| Cover / key art | 1 | Approved image that clearly identifies the entity |
| Concept sheet | 1 | Multiple views, scale reference, structure/anatomy details, forms and surface materials |
| Supporting illustrations | 0–3 | Optional habitat, behavior, interaction, or transformation scenes |
| Chibi asset | 1 reserved package | Future small in-game representation, with preview, source, runtime asset and animation metadata when available |

Use `null` for absent assets, not fabricated paths. Keep asset provenance and draft/approved state. Existing bestiary illustrations are retained; replacement requires an explicit reason and a reference check.

## Completion review

Verify species identity, all form relationships, preserved source content, image references, unsupported origin claims, and applicability of biological fields. Review the rendered page before marking it complete.
