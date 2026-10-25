import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("chibi_import", ROOT / "tools/import-chibi-review.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
ATLAS = ROOT / "assets/chibi-review/385f1bae-5ade-411d-abd1-850d74944004/atlas.png"


class ChibiLayoutTests(unittest.TestCase):
    def test_nonuniform_gutters_preserve_native_pixels_per_unit(self):
        before = ATLAS.read_bytes()
        layout, analysis = MODULE.analyse_atlas(ATLAS)
        self.assertEqual([0, 418, 846, 1254], analysis["xCuts"])
        self.assertEqual([0, 438, 839, 1254], analysis["yCutsTopOrigin"])
        self.assertEqual([], analysis["warnings"])
        self.assertEqual(418, layout["nominalCellHeight"])
        self.assertNotEqual(layout["frames"][0]["rect"]["height"], layout["frames"][3]["rect"]["height"])
        self.assertEqual(before, ATLAS.read_bytes())

    def test_manual_cut_cannot_silently_accept_sliced_character(self):
        _, analysis = MODULE.analyse_atlas(ATLAS, {"xCuts": [0, 418, 836, 1254], "yCuts": [0, 418, 836, 1254]})
        self.assertTrue(analysis["warnings"])

    def test_explicit_foot_override_changes_only_metadata(self):
        layout, _ = MODULE.analyse_atlas(ATLAS, {"pivots": {"3": {"x": .55, "y": .04}}})
        self.assertEqual({"x": .55, "y": .04}, layout["frames"][3]["pivot"])
        self.assertEqual(418, layout["nominalCellWidth"])


if __name__ == "__main__":
    unittest.main()
