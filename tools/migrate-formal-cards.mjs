console.warn("tools/migrate-formal-cards.mjs is retained as a compatibility alias. data/cards.json is now authoritative.");
await import("./sync-cards-from-data.mjs");
