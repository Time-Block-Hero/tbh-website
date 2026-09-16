# Character dossier template

## Identity

| Field | Required content |
| --- | --- |
| Stable ID | Permanent dossier slug, independent of reorderable card ID |
| Name and aliases | Current source names; approved aliases only |
| Class / faction | Current card class, or explicitly approved story-only affiliation |
| Role / species | Source-backed identity; unresolved fields marked incomplete |
| Source links | Artwork keys, current card IDs, source revision, approved decisions |
| Status | Draft, confirmed, or incomplete; track by section when appropriate |

## Text sections

- **Summary:** a short factual identity statement based on approved material.
- **Appearance:** silhouette, face, hair, body/species, clothing, palette, materials, distinctive features.
- **Equipment and forms:** named equipment, alternate forms, and their visual continuity; separate a vehicle from a person's bodily form.
- **Personality:** only approved traits. An illustration pose does not establish a complete personality.
- **Biography:** confirmed events only; otherwise incomplete.
- **Relationships:** named counterpart, approved relationship, and source. Do not infer relationships from shared class membership.
- **Gameplay references:** links to current cards and relevant rule pages; card effects are not automatically narrative powers.
- **Production notes:** missing details, art checklist, and explicit constraints.

## Asset slots

| Slot | Count | Specification |
| --- | --- | --- |
| Cover / key art | 1 | Current approved primary image; selected card art may serve initially |
| Concept sheet | 1 | Front/side/back views, expressions, outfit/equipment details, palette, form differences as applicable |
| Supporting illustrations | 0–3 | Optional scenes or expressions with a stated purpose; not arbitrary decoration |
| Chibi asset | 1 reserved package | Placeholder for future small in-game character: source file, preview, sprite/atlas or model, animation list, scale and pivot when implemented |

Each actual asset record should carry a relative path, role, draft/approved status, source/reference, and licensing/provenance information. Missing assets stay `null`. Do not invent a chibi file or choose its eventual engine format during lore authoring.

## Completion review

Check the latest card source, canonical name, exact form associations, selected cover, unsupported lore, missing mandatory fields, and every local image path. Review a rendered page before marking the dossier complete.
