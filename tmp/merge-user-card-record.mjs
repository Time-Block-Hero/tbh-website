import fs from "node:fs";
import path from "node:path";

const root = "/Users/jesusmicah/Documents/tbh-website";
const userPath = "/Users/jesusmicah/Downloads/cards (1).json";
const projectPath = path.join(root, "data/cards.json");
const userData = JSON.parse(fs.readFileSync(userPath, "utf8"));
const projectData = JSON.parse(fs.readFileSync(projectPath, "utf8"));
const projectCards = new Map(projectData.cards.map((card) => [card.id, card]));

const artFields = [
  "artPath",
  "artworkKey",
  "artDescription",
  "artDescriptionNeedsPolish",
  "artRequest",
];

const merged = structuredClone(userData);
for (const card of merged.cards) {
  const stored = projectCards.get(card.id);
  if (!stored) continue;
  for (const field of artFields) {
    if (Object.hasOwn(stored, field)) card[field] = structuredClone(stored[field]);
  }
  if (String(stored.englishName || "").trim()) card.englishName = stored.englishName;
}

merged.artworkVariants = structuredClone(projectData.artworkVariants || {});
merged.selectedArtworkIds = structuredClone(projectData.selectedArtworkIds || {});

const restoredLegendaryArt = {
  "MCC-000": {
    englishName: "Mira-10K",
    artworkKey: "mira-10k",
    prompt: "tmp/artwork-prompts/machine-heaven-legendary/mcc-000.txt",
    variants: ["mira-10k-01", "mira-10k-02"],
  },
  "MCC-005": {
    englishName: "Swarm Overmind—Emilys",
    artworkKey: "swarm-overmind-emilys",
    prompt: "tmp/artwork-prompts/machine-heaven-legendary/mcc-005-revised.txt",
    variants: ["swarm-overmind-emilys-05", "swarm-overmind-emilys-06", "swarm-overmind-emilys-07"],
  },
  "MCC-009": {
    englishName: "Lost Sword—Jinbai",
    artworkKey: "lost-sword-jinbai",
    prompt: "tmp/artwork-prompts/machine-heaven-legendary/mcc-009.txt",
    variants: ["lost-sword-jinbai-01"],
  },
  "MCC-009-01": {
    englishName: "Ascended Sword—Jinbai",
    artworkKey: "ascended-sword-jinbai",
    prompt: "tmp/artwork-prompts/machine-heaven-legendary/mcc-009-01.txt",
    variants: ["ascended-sword-jinbai-01"],
  },
};

for (const [cardId, art] of Object.entries(restoredLegendaryArt)) {
  const card = merged.cards.find((entry) => entry.id === cardId);
  if (!card) throw new Error(`Missing card ${cardId}`);
  const promptPath = path.join(root, art.prompt);
  if (!fs.existsSync(promptPath)) throw new Error(`Missing prompt ${promptPath}`);
  card.englishName = art.englishName;
  card.artworkKey = art.artworkKey;
  card.artDescription = fs.readFileSync(promptPath, "utf8").trim();
  card.artDescriptionNeedsPolish = false;
  card.artRequest = 0;
  const variants = art.variants.map((id) => {
    const src = `./assets/card-art/${art.artworkKey}/${id}.png`;
    const absolute = path.join(root, src.slice(2));
    if (!fs.existsSync(absolute)) throw new Error(`Missing artwork ${absolute}`);
    return { id, src };
  });
  merged.artworkVariants[cardId] = variants;
  merged.selectedArtworkIds[cardId] = variants[0].id;
}

const outputPath = `${projectPath}.merge-tmp`;
fs.writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`);
JSON.parse(fs.readFileSync(outputPath, "utf8"));
fs.renameSync(outputPath, projectPath);

console.log(JSON.stringify({
  cardCount: merged.cards.length,
  artworkVariantCardCount: Object.keys(merged.artworkVariants).length,
  selectedArtworkCount: Object.keys(merged.selectedArtworkIds).length,
}, null, 2));
