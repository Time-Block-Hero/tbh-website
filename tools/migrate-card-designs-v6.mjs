import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import contract from "../card-design-contract.js";

// Explicit authoring-only migration. The source is never overwritten and no
// execution hash is re-approved; review the result before replacing cards.json.
export function migrateFile(input, output) {
  if (path.resolve(input) === path.resolve(output)) throw new Error("Migration requires a separate output path; keep the source as a backup");
  const source = JSON.parse(fs.readFileSync(input, "utf8"));
  const migrated = contract.migrateDataset(source);
  fs.writeFileSync(output, `${JSON.stringify(migrated, null, 2)}\n`, { flag: "wx" });
  return migrated;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args[0] !== "--input" || !args[1] || !(args.length === 4 && args[2] === "--output" || args.length === 3 && ["--check", "--write"].includes(args[2]))) {
      throw new Error("Usage: node tools/migrate-card-designs-v6.mjs --input data/cards.json (--output /tmp/cards-schema6.json | --check | --write)");
    }
    if (args[2] === "--output") {
      const migrated = migrateFile(args[1], args[3]);
      console.log(`Migrated ${migrated.cards.length} cards to schema ${migrated.schemaVersion}; execution definitions unchanged.`);
    } else {
      const sourceText = fs.readFileSync(args[1], "utf8"), source = JSON.parse(sourceText);
      const migrated = contract.migrateDataset(source);
      if (JSON.stringify(source) === JSON.stringify(migrated)) console.log("Dataset is already schema 6; no changes required.");
      else if (args[2] === "--check") throw new Error("Dataset needs the explicit schema 6 migration");
      else {
        const backup = `${args[1]}.schema5.backup.json`;
        fs.writeFileSync(backup, sourceText, { flag: "wx" });
        const temporary = `${args[1]}.schema6-${process.pid}.tmp`;
        try {
          fs.writeFileSync(temporary, `${JSON.stringify(migrated, null, 2)}\n`, { flag: "wx" });
          fs.renameSync(temporary, args[1]);
        } finally { fs.rmSync(temporary, { force: true }); }
        console.log(`Migrated ${migrated.cards.length} cards; backup retained at ${backup}.`);
      }
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
