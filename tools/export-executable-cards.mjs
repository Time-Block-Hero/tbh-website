import fs from 'node:fs';
import path from 'node:path';
import { toAuthoringDocument } from './card-execution.mjs';
// Explicit files make this adapter usable from a frozen source checkout. It performs
// no provenance claims: the consuming build must verify its source lock/commit.
try {
  const args = process.argv.slice(2), values = {};
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    if (!['--input', '--options', '--output'].includes(flag) || values[flag] || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Invalid argument: ${flag}`);
    values[flag] = args[i + 1];
  }
  for (const flag of ['--input', '--options', '--output']) if (!values[flag]) throw new Error(`Required: ${flag}`);
  const input = path.resolve(values['--input']), output = path.resolve(values['--output']);
  if (input === output || path.resolve(values['--options']) === output) throw new Error('Output cannot overwrite an input');
  const options = JSON.parse(fs.readFileSync(values['--options'], 'utf8'));
  if (Object.hasOwn(options, 'validate')) throw new Error('The executable exporter cannot skip production validation');
  const document = toAuthoringDocument(JSON.parse(fs.readFileSync(input, 'utf8')), options);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Exported ${document.cardBundles.length} executable cards.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
