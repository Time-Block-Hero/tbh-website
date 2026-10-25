#!/usr/bin/env python3
"""Mirror original RGBA atlases and measure their layout without editing pixels.

Only image analysis uses Pillow. All colours, alpha and native dimensions remain
byte-identical to the source. A cell has a shared nominal pixels-per-unit scale;
variable crop rectangles do not resize the character from frame to frame.
"""
import argparse
import hashlib
import io
import json
import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
CLIPS = {
    "idle": {"frames": [0, 1, 2], "fps": 3, "loop": True},
    "move": {"frames": [3, 4, 5], "fps": 6, "loop": True},
    "hit": {"frames": [6], "fps": 6, "loop": False},
    "attack": {"frames": [7], "fps": 6, "loop": False},
    "effect": {"frames": [8], "fps": 6, "loop": False},
}


def analyse_atlas(file, overrides=None):
    overrides = overrides or {}
    with Image.open(file) as image:
        if image.mode != "RGBA":
            raise ValueError(f"Atlas must contain native transparency (RGBA): {file}")
        w, h = image.size
        alpha = image.getchannel("A")
        pixels = list(alpha.get_flattened_data() if hasattr(alpha, "get_flattened_data") else alpha.getdata())
    x_counts = [0] * w
    y_counts = [0] * h
    for y in range(h):
        for x in range(w):
            if pixels[y * w + x] > 16:
                x_counts[x] += 1
                y_counts[y] += 1
    warnings = []

    def cuts(counts, length, axis, record=True):
        found = [0]
        for n in (1, 2):
            ideal = round(length * n / 3)
            lo, hi = max(1, ideal - 60), min(length - 1, ideal + 61)
            cut = min(range(lo, hi), key=lambda i: (counts[i], abs(i - ideal)))
            if counts[cut] and record:
                warnings.append(f"{axis}={cut} crosses {counts[cut]} visible pixels; manual separation required")
            found.append(cut)
        return found + [length]

    xs = overrides.get("xCuts") or cuts(x_counts, w, "x", record=False)
    ys = overrides.get("yCuts") or cuts(y_counts, h, "y")
    for name, values, length in (("xCuts", xs, w), ("yCuts", ys, h)):
        if len(values) != 4 or values[0] != 0 or values[-1] != length or any(a >= b for a, b in zip(values, values[1:])):
            raise ValueError(f"Invalid {name}")
    for axis, positions, counts in (("y", ys, y_counts),):
        for cut in positions[1:-1]:
            warning = f"{axis}={cut} crosses {counts[cut]} visible pixels; manual separation required"
            if counts[cut] and warning not in warnings:
                warnings.append(warning)
    row_xs = []
    for row in range(3):
        counts = [0] * w
        for y in range(ys[row], ys[row + 1]):
            for x in range(w):
                if pixels[y * w + x] > 16:
                    counts[x] += 1
        if overrides.get("rowXCuts"):
            selected = overrides["rowXCuts"][row]
        elif overrides.get("xCuts") or all(counts[cut] == 0 for cut in xs[1:-1]):
            selected = xs
        else:
            selected = cuts(counts, w, f"row{row}.x", record=False)
        if len(selected) != 4 or selected[0] != 0 or selected[-1] != w or any(a >= b for a, b in zip(selected, selected[1:])):
            raise ValueError(f"Invalid rowXCuts on row {row}")
        for cut in selected[1:-1]:
            if counts[cut]:
                warnings.append(f"row{row}.x={cut} crosses {counts[cut]} visible pixels; manual separation required")
        row_xs.append(selected)
    # Some sheets align columns but stagger the feet/head clearance between rows.
    # Choose the other axis first when it gives a lossless rectangular partition.
    column_ys = None
    if any(y_counts[cut] for cut in ys[1:-1]) and all(x_counts[cut] == 0 for cut in xs[1:-1]) and not overrides:
        proposal = []
        for col in range(3):
            counts = [sum(pixels[y * w + x] > 16 for x in range(xs[col], xs[col + 1])) for y in range(h)]
            selected = cuts(counts, h, f"column{col}.y", record=False)
            if any(counts[cut] for cut in selected[1:-1]):
                break
            proposal.append(selected)
        if len(proposal) == 3:
            column_ys = proposal
            warnings = [warning for warning in warnings if not warning.startswith(("y=", "row"))]
    edges = {"top": sum(v > 160 for v in pixels[:w]), "bottom": sum(v > 160 for v in pixels[-w:]),
             "left": sum(pixels[y * w] > 160 for y in range(h)), "right": sum(pixels[y * w + w - 1] > 160 for y in range(h))}
    for edge, count in edges.items():
        if count > 6:
            warnings.append(f"Atlas {edge} edge touches {count} opaque pixels; inspect for clipping")
    frames = []
    frame_metrics = []
    for i in range(9):
        col, row = i % 3, i // 3
        if column_ys:
            x0, x1, y0, y1 = xs[col], xs[col + 1], column_ys[col][row], column_ys[col][row + 1]
        else:
            x0, x1, y0, y1 = row_xs[row][col], row_xs[row][col + 1], ys[row], ys[row + 1]
        cell = alpha.crop((x0, y0, x1, y1))
        solid = cell.point(lambda v: 255 if v > 160 else 0)
        bounds = solid.getbbox()
        if bounds is None:
            warnings.append(f"Frame {i} is empty")
            pivot = {"x": 0.5, "y": 0}
        else:
            left, top, right, bottom = bounds
            feet = solid.crop((0, max(0, bottom - 21), x1 - x0, bottom)).getbbox()
            anchor = (feet[0] + feet[2]) / 2 if feet else (left + right) / 2
            pivot = {"x": round(anchor / (x1 - x0), 7), "y": round((y1 - y0 - bottom) / (y1 - y0), 7)}
        if str(i) in overrides.get("pivots", {}):
            pivot = overrides["pivots"][str(i)]
        if not all(isinstance(v, (int, float)) and 0 <= v <= 1 for v in pivot.values()):
            raise ValueError(f"Invalid pivot on frame {i}")
        frames.append({"rect": {"x": x0, "y": h - y1, "width": x1 - x0, "height": y1 - y0}, "pivot": pivot})
        frame_metrics.append({"index": i, "opaqueBoundsTopOrigin": list(bounds) if bounds else None,
                              "visibleWidthInTiles": round((bounds[2] - bounds[0]) * 1.1 / (h / 3), 3) if bounds else 0,
                              "visibleHeightInTiles": round((bounds[3] - bounds[1]) * 1.1 / (h / 3), 3) if bounds else 0})
    layout = {"schemaVersion": 1, "sourceWidth": w, "sourceHeight": h, "columns": 3, "rows": 3,
              "nominalCellWidth": w / 3, "nominalCellHeight": h / 3,
              "frames": frames, "clips": CLIPS}
    return layout, {"xCuts": xs, "rowXCuts": row_xs, "yCutsTopOrigin": ys, "columnYCutsTopOrigin": column_ys,
                    "partitionStrategy": "column-first" if column_ys else "row-first", "warnings": warnings,
                    "outerEdgeContacts": edges, "frameMetrics": frame_metrics,
                    "pivotMethod": "opaque bottom contact; inspect/override pivots for airborne poses"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--generated-root", type=pathlib.Path, required=True)
    parser.add_argument("--source-roster", type=pathlib.Path, required=True)
    parser.add_argument("--only", help="Optional comma-separated card IDs")
    parser.add_argument("--root", type=pathlib.Path, default=ROOT)
    args = parser.parse_args()
    manifest_path = args.root / "data/chibi-review.json"
    manifest = json.loads(manifest_path.read_text())
    notes_path = args.root / "data/chibi-review-notes.json"
    notes = json.loads(notes_path.read_text()).get("entries", []) if notes_path.exists() else []
    roster = json.loads(args.source_roster.read_text())
    cards = json.loads((args.root / "data/cards.json").read_text())["cards"]
    scale_path = args.root / "data/chibi-review-scale.json"
    scale_profiles = json.loads(scale_path.read_text()) if scale_path.exists() else {"profiles": {}}
    units = {c["uid"] for c in cards if c["cardType"] == "Minion"}
    entries = {e["uid"]: e for e in manifest["entries"]}
    imported = []
    skipped = []
    only = set(args.only.split(",")) if args.only else None
    for source in roster["entries"]:
        if only and source["id"] not in only:
            continue
        uid = source["uid"]
        if uid not in units:
            raise ValueError(f"Unknown unit UID: {uid}")
        if uid == manifest["baseline"]["uid"]:
            continue  # Keep the user-selected original untouched.
        directory = args.generated_root / source["id"]
        atlas = directory / "atlas.png"
        if not atlas.is_file():
            continue
        metadata_file = directory / "metadata.json"
        try:
            metadata = json.loads(metadata_file.read_text()) if metadata_file.exists() else {}
        except json.JSONDecodeError:
            skipped.append({"id": source["id"], "reason": "Producer metadata is still being written"})
            continue
        if metadata.get("status") != "generated":
            skipped.append({"id": source["id"], "reason": "Producer has not marked this candidate generated"})
            continue
        if metadata.get("id") != source["id"] or metadata.get("uid") != uid:
            skipped.append({"id": source["id"], "reason": "Producer identity does not match the canonical roster"})
            continue
        atlas_bytes = atlas.read_bytes()
        atlas_hash = hashlib.sha256(atlas_bytes).hexdigest()
        if metadata.get("atlasSha256") != atlas_hash:
            skipped.append({"id": source["id"], "reason": "Producer metadata does not match atlas SHA-256"})
            continue
        layout, analysis = analyse_atlas(io.BytesIO(atlas_bytes), metadata.get("layoutOverrides"))
        destination = args.root / "assets/chibi-review" / uid
        destination.mkdir(parents=True, exist_ok=True)
        (destination / "atlas.png").write_bytes(atlas_bytes)
        (destination / "layout.json").write_text(json.dumps(layout, ensure_ascii=False, indent=2) + "\n")
        status = "needs-fix" if analysis["warnings"] else "generated"
        previous = entries.get(uid, {})
        if (status == "generated" and previous.get("status") == "reviewed"
                and previous.get("atlasSha256") == atlas_hash and previous.get("layout") == layout):
            status = "reviewed"
        qa_notes = [note for note in notes if note.get("uid") == uid and note.get("atlasSha256") == atlas_hash]
        if qa_notes:
            status = "needs-fix"
        entries[uid] = {"uid": uid, "status": status, "atlasSrc": f"./assets/chibi-review/{uid}/atlas.png",
                        "atlasSha256": atlas_hash, "frameCount": 9,
                        "layout": layout, "analysis": analysis, "qaNotes": [text for note in qa_notes for text in note.get("notes", [])],
                        "provenance": {"sourceCardId": source["id"], "sourceArtId": source.get("selectedArtId"),
                                       "styleReferenceSha256": roster.get("styleReferenceSha256"),
                                       "note": "本轮按洛岚黄金参考重绘；原生透明图集，尚未完成美术审阅"}}
        imported.append({"id": source["id"], "status": status, **analysis})
    # Safe transparent gutters may differ between sheets. Measure the first idle
    # body once, then use this single world-space scale for every pose in the set.
    baseline = manifest["baseline"]
    rect = baseline["layout"]["frames"][0]["rect"]
    with Image.open(args.root / baseline["atlasSrc"]) as reference:
        top = reference.height - rect["y"] - rect["height"]
        bounds = reference.getchannel("A").crop((rect["x"], top, rect["x"] + rect["width"], top + rect["height"])).point(lambda a: 255 if a > 160 else 0).getbbox()
    target_height = (bounds[3] - bounds[1]) * 1.1 / baseline["layout"]["nominalCellHeight"]
    for uid, entry in entries.items():
        metrics = entry.get("analysis", {}).get("frameMetrics", [])
        profile = scale_profiles.get("profiles", {}).get(uid)
        if not metrics or not profile or not metrics[0].get("opaqueBoundsTopOrigin"):
            continue
        box = metrics[0]["opaqueBoundsTopOrigin"]
        width, height = box[2] - box[0], box[3] - box[1]
        nominal = entry["layout"]["nominalCellHeight"]
        display_height = target_height * nominal / height
        if profile["profile"] == "wide":
            display_height = min(display_height, scale_profiles.get("wideTargetWidthInTiles", .95) * nominal / width)
        entry["display"] = {"profile": profile["profile"], "heightInTiles": round(display_height, 6),
                            "referenceFrame": 0, "targetVisibleHeightInTiles": round(target_height, 6),
                            "method": "first-idle body; one shared scale for all nine frames"}
    manifest["entries"] = sorted(entries.values(), key=lambda e: e["uid"])
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"imported": imported, "skipped": skipped, "totalCandidates": sum(e["status"] == "generated" for e in entries.values())}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
