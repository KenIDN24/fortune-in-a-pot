import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Fortune in a Pot — one kind, funny fortune for a houseplant (95 chars, gate 1-120).
// Source: panel penuh Mistral, [deepseek-v4-1-flash-1017].
// QA: ramalan untuk tanaman ini sendiri (sebuah fern, penyiraman hari Kamis),
// lelucon lembut soal overwatering yang dikenali pecinta tanaman,
// hangat ("you will forgive") tanpa doom/layu/ejekan,
// kadens ramalan murni ("You will ... You will ...").
const ENTRY =
  "You will be watered on Thursday. It will be too much. You will forgive, because you are a fern.";

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

// Gate: 1-120 chars, single line, no leading/trailing whitespace,
// no double spaces, and it must end on a period so it reads aloud
// as one finished fortune.
if (ENTRY.length < 1 || ENTRY.length > 120) {
  throw new Error(`entry length ${ENTRY.length} outside 1-120`);
}
if (ENTRY.trim() !== ENTRY || ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single clean line");
}
if (ENTRY.includes("  ") || !ENTRY.endsWith(".")) {
  throw new Error("entry must have no double spaces and end with a period");
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip check: what was written is exactly the entry.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("round-trip mismatch");
}
console.log(`wrote ${outPath} (${ENTRY.length} chars)`);
