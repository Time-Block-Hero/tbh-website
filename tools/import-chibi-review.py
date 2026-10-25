#!/usr/bin/env python3
"""Mirror original RGBA atlases and measure their layout without editing pixels.

Only image analysis uses Pillow. All colours, alpha and native dimensions remain
byte-identical to the source. A cell has a shared nominal pixels-per-unit scale;
variable crop rectangles do not resize the character from frame to frame.
"""
import argparse
import hashlib
import json
import pathlib
import shutil

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

    def cuts(counts, length, axis):
        found = [0]
        for n in (1, 2):
            ideal = round(length * n / 3)
            lo, hi = max(1, ideal - 60), min(length - 1, ideal + 61)
            cut = min(range(lo, hi), key=lambda i: (counts[i], abs(i - ideal)))
            if counts[cut]:
                warnings.append(f"{axis}={cut} crosses {counts[cut]} visible pixels; manual separation required")
            found.append(cut)
        return found + [length]

    xs = overrides.get("xCuts") or cuts(x_counts, w, "x")
    ys = overrides.get("yCuts") or cuts(y_counts, h, "y")
    for name, values, length in (("xCuts", xs, w), ("yCuts", ys, h)):
        if len(values) != 4 or values[0] != 0 or values[-1] != length or any(a >= b for a, b in zip(values, values[1:])):
            raise ValueError(f"Invalid {name}")
    for axis, positions, counts in (("x", xs, x_counts), ("y", ys, y_counts)):
        for cut in positions[1:-1]:
            warning = f"{axis}={cut} crosses {counts[cut]} visible pixels; manual separation required"
            if counts[cut] and warning not in warnings:
                warnings.append(warning)
    frames = []
    for i in range(9):
        col, row = i % 3, i // 3
        x0, x1, y0, y1 = xs[col], xs[col + 1], ys[row], ys[row + 1]
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
    layout = {"schemaVersion": 1, "sourceWidth": w, "sourceHeight": h, "columns": 3, "rows": 3,
              "nominalCellWidth": w / 3, "nominalCellHeight": h / 3,
              "frames": frames, "clips": CLIPS}
    return layout, {"xCuts": xs, "yCutsTopOrigin": ys, "warnings": warnings,
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
    roster = json.loads(args.source_roster.read_text())
    cards = json.loads((args.root / "data/cards.json").read_text())["cards"]
    units = {c["uid"] for c in cards if c["cardType"] == "Minion"}
    entries = {e["uid"]: e for e in manifest["entries"]}
    imported = []
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
        metadata = json.loads(metadata_file.read_text()) if metadata_file.exists() else {}
        layout, analysis = analyse_atlas(atlas, metadata.get("layoutOverrides"))
        destination = args.root / "assets/chibi-review" / uid
        destination.mkdir(parents=True, exist_ok=True)
        shutil.copy2(atlas, destination / "atlas.png")
        (destination / "layout.json").write_text(json.dumps(layout, ensure_ascii=False, indent=2) + "\n")
        status = "needs-fix" if analysis["warnings"] else "generated"
        previous = entries.get(uid, {})
        atlas_hash = hashlib.sha256(atlas.read_bytes()).hexdigest()
        if (status == "generated" and previous.get("status") == "reviewed"
                and previous.get("atlasSha256") == atlas_hash and previous.get("layout") == layout):
            status = "reviewed"
        entries[uid] = {"uid": uid, "status": status, "atlasSrc": f"./assets/chibi-review/{uid}/atlas.png",
                        "atlasSha256": atlas_hash, "frameCount": 9,
                        "layout": layout, "analysis": analysis,
                        "provenance": {"sourceCardId": source["id"], "sourceArtId": source.get("selectedArtId"),
                                       "styleReferenceSha256": roster.get("styleReferenceSha256"),
                                       "note": "本轮按洛岚黄金参考重绘；原生透明图集，尚未完成美术审阅"}}
        imported.append({"id": source["id"], "status": status, **analysis})
    manifest["entries"] = sorted(entries.values(), key=lambda e: e["uid"])
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"imported": imported, "totalCandidates": sum(e["status"] == "generated" for e in entries.values())}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
