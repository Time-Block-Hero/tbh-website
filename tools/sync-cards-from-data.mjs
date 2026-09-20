import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import contract from "../card-design-contract.js";
import { exportDirtyDesigns } from "./export-card-designs.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cardsPath = path.join(root, "data", "cards.json");
const dataset = contract.validateDataset(JSON.parse(fs.readFileSync(cardsPath, "utf8")));
dataset.sourceSchemaVersion = dataset.schemaVersion;
dataset.source = "data/cards.json";
const text = `${JSON.stringify(dataset, null, 2)}\n`;
fs.writeFileSync(cardsPath, text);
// This old filename is now an explicitly non-runtime, dirty design preview.
// Never read it back or inherit historical executable abilities and support labels.
fs.writeFileSync(path.join(root, "formal_card_ref.json"), `${JSON.stringify(exportDirtyDesigns(root, { requireCompleteBaseline: false }), null, 2)}\n`);
fs.writeFileSync(path.join(root, "ReferenceDocs", "cards (1).json"), text);
await import(`./build-card-editor-fallback.mjs?sync=${Date.now()}`);
const { buildSettingFile } = await import("./build-setting-data.mjs");
buildSettingFile(root);
await import(`./build-bestiary.mjs?sync=${Date.now()}`);
console.log(`Synced ${dataset.cards.length} designs; formal_card_ref.json is a non-runtime development preview.`);
