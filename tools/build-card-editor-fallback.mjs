import fs from "node:fs";
import { buildEditorFallback } from "./card-editor-fallback.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cards = JSON.parse(fs.readFileSync(path.join(root, "data/cards.json"), "utf8"));
const layout = JSON.parse(fs.readFileSync(path.join(root, "card_layout_ref/layout.json"), "utf8"));
const output = buildEditorFallback(root, cards, layout);

fs.writeFileSync(path.join(root, "card-editor-data.js"), output);
console.log("Built card-editor-data.js for direct file opening.");
