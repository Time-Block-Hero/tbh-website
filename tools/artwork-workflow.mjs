import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cardsPath = path.join(root, "data/cards.json");
const data = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
const [command, ...args] = process.argv.slice(2);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function cardById(id) {
  const card = data.cards.find((entry) => entry.id === id);
  if (!card) fail(`Unknown card id: ${id}`);
  return card;
}

function artworkKeyFromEnglishName(englishName) {
  return String(englishName || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function artworkKeyFor(card) {
  const key = card.artworkKey || artworkKeyFromEnglishName(card.englishName);
  if (!key) fail(`${card.id} (${card.nameKey}) needs an English name before artwork generation.`);
  const conflict = data.cards.find((entry) => entry.id !== card.id
    && (entry.artworkKey || artworkKeyFromEnglishName(entry.englishName)) === key);
  if (conflict) fail(`Artwork key "${key}" conflicts with ${conflict.id} (${conflict.nameKey}).`);
  return key;
}

function writeData() {
  fs.writeFileSync(cardsPath, `${JSON.stringify(data, null, 2)}\n`);
}

async function rebuildFallback() {
  await import(`./build-card-editor-fallback.mjs?updated=${Date.now()}`);
}

function queueCards(predicate) {
  const requestedIds = new Set(args);
  const cards = data.cards.filter((card) => (!requestedIds.size || requestedIds.has(card.id)) && predicate(card));
  console.log(JSON.stringify(cards.map((card) => ({
    id: card.id,
    name: card.nameKey,
    englishName: card.englishName || "",
    artworkKey: card.artworkKey || artworkKeyFromEnglishName(card.englishName),
    faction: card.classId,
    type: card.cardType,
    description: card.artDescription || "",
    needsPolish: Boolean(card.artDescriptionNeedsPolish),
    artRequest: Math.max(0, Math.trunc(Number(card.artRequest) || 0)),
  })), null, 2));
}

if (command === "polish-queue") {
  queueCards((card) => card.artDescriptionNeedsPolish);
} else if (command === "request-queue") {
  queueCards((card) => Number(card.artRequest) > 0);
} else if (command === "set-description") {
  const [cardId, descriptionFile] = args;
  if (!cardId || !descriptionFile) fail("Usage: set-description CARD_ID DESCRIPTION_FILE");
  const card = cardById(cardId);
  card.artDescription = fs.readFileSync(path.resolve(descriptionFile), "utf8").trim();
  card.artDescriptionNeedsPolish = false;
  writeData();
  await rebuildFallback();
  console.log(`Updated ${cardId} artwork description.`);
} else if (command === "register") {
  const [cardId, sourcePath] = args;
  if (!cardId || !sourcePath) fail("Usage: register CARD_ID IMAGE_PATH");
  const card = cardById(cardId);
  const absoluteSource = path.resolve(sourcePath);
  if (!fs.existsSync(absoluteSource)) fail(`Image does not exist: ${absoluteSource}`);
  const artworkKey = artworkKeyFor(card);
  data.artworkVariants ||= {};
  data.selectedArtworkIds ||= {};
  const variants = data.artworkVariants[cardId] ||= [];
  const existing = variants.find((variant) => path.resolve(root, variant.src) === absoluteSource);
  if (existing) {
    console.log(JSON.stringify(existing));
    process.exit(0);
  }
  const used = new Set(variants.map((variant) => variant.id));
  const targetDirectory = path.join(root, "assets", "card-art", artworkKey);
  fs.mkdirSync(targetDirectory, { recursive: true });
  for (const filename of fs.readdirSync(targetDirectory)) {
    const match = filename.match(new RegExp(`^${artworkKey}-(\\d{2})\\.[^.]+$`));
    if (match) used.add(`${artworkKey}-${match[1]}`);
  }
  const sourceMatch = path.dirname(absoluteSource) === targetDirectory
    ? path.basename(absoluteSource).match(new RegExp(`^${artworkKey}-(\\d{2})\\.[^.]+$`))
    : null;
  let variantId;
  let targetPath;
  if (sourceMatch) {
    variantId = `${artworkKey}-${sourceMatch[1]}`;
    if (variants.some((variant) => variant.id === variantId)) fail(`Artwork variant already registered: ${variantId}`);
    targetPath = absoluteSource;
  } else {
    let order = 1;
    while (used.has(`${artworkKey}-${String(order).padStart(2, "0")}`)) order += 1;
    variantId = `${artworkKey}-${String(order).padStart(2, "0")}`;
    const extension = path.extname(absoluteSource).toLowerCase() || ".png";
    targetPath = path.join(targetDirectory, `${variantId}${extension}`);
    fs.copyFileSync(absoluteSource, targetPath, fs.constants.COPYFILE_EXCL);
  }
  const relativeSource = `./${path.relative(root, targetPath).split(path.sep).join("/")}`;
  const variant = { id: variantId, src: relativeSource };
  variants.push(variant);
  card.artworkKey = artworkKey;
  data.selectedArtworkIds[cardId] ||= variant.id;
  card.artRequest = Math.max(0, Math.trunc(Number(card.artRequest) || 0) - 1);
  writeData();
  await rebuildFallback();
  console.log(JSON.stringify(variant));
} else if (command === "select") {
  const [cardId, variantId] = args;
  cardById(cardId);
  const variants = data.artworkVariants?.[cardId] || [];
  if (!variants.some((variant) => variant.id === variantId)) fail(`Unknown artwork variant ${variantId} for ${cardId}`);
  data.selectedArtworkIds ||= {};
  data.selectedArtworkIds[cardId] = variantId;
  writeData();
  await rebuildFallback();
  console.log(`Selected ${variantId} for ${cardId}.`);
} else {
  fail("Usage: artwork-workflow.mjs <polish-queue|request-queue|set-description|register|select> [...args]");
}
