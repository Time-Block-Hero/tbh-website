import importlib.util
import pathlib
import unittest
import tempfile
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("chibi_import", ROOT / "tools/import-chibi-review.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class ChibiLayoutTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Analytical alpha rectangles, not artwork: fixed off-grid clear gutters
        # remain stable when artists replace the real review candidates.
        cls.directory = tempfile.TemporaryDirectory()
        cls.atlas = pathlib.Path(cls.directory.name) / "layout-fixture.png"
        image = Image.new("RGBA", (300, 300), (0, 0, 0, 0))
        for y0, y1 in [(10, 109), (125, 206), (222, 290)]:
            for x0, x1 in [(10, 94), (112, 203), (218, 290)]:
                for y in range(y0, y1 + 1):
                    for x in range(x0, x1 + 1):
                        image.putpixel((x, y), (90, 140, 180, 255))
        image.save(cls.atlas)

    @classmethod
    def tearDownClass(cls):
        cls.directory.cleanup()

    def test_nonuniform_gutters_preserve_native_pixels_per_unit(self):
        before = self.atlas.read_bytes()
        layout, analysis = MODULE.analyse_atlas(self.atlas)
        self.assertEqual([0, 100, 204, 300], analysis["xCuts"])
        self.assertEqual([0, 110, 207, 300], analysis["yCutsTopOrigin"])
        self.assertEqual([], analysis["warnings"])
        self.assertEqual(100, layout["nominalCellHeight"])
        self.assertNotEqual(layout["frames"][0]["rect"]["height"], layout["frames"][3]["rect"]["height"])
        self.assertEqual(before, self.atlas.read_bytes())

    def test_manual_cut_cannot_silently_accept_sliced_character(self):
        _, analysis = MODULE.analyse_atlas(self.atlas, {"xCuts": [0, 100, 200, 300], "yCuts": [0, 100, 200, 300]})
        self.assertTrue(analysis["warnings"])

    def test_explicit_foot_override_changes_only_metadata(self):
        layout, _ = MODULE.analyse_atlas(self.atlas, {"pivots": {"3": {"x": .55, "y": .04}}})
        self.assertEqual({"x": .55, "y": .04}, layout["frames"][3]["pivot"])
        self.assertEqual(100, layout["nominalCellWidth"])


if __name__ == "__main__":
    unittest.main()
