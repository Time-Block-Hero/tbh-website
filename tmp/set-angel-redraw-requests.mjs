import fs from "node:fs";

const cardsPath = new URL("../data/cards.json", import.meta.url);
const data = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
const requests = new Map([
  ["FNG-004", 0],
  ["FNG-005", 0],
  ["FNG-006", 0],
  ["MCC-007", 1],
  ["MCC-011", 1],
  ["MCC-014", 1],
]);

for (const card of data.cards) {
  if (requests.has(card.id)) card.artRequest = requests.get(card.id);
}

fs.writeFileSync(cardsPath, `${JSON.stringify(data, null, 2)}\n`);
