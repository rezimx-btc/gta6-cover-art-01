// Leonida Cover Studio — entrypoint (make.fun program/v1).
// Copies app/ and screenshots/ from this repository to the output
// directory and writes /output/dossier.json with buildDossier from
// vendor/makefun-app.ts. Node 22 standard library only, no network,
// deterministic: two runs write the same bytes.
import { buildDossier } from "./vendor/makefun-app.ts";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const TEXT_MAX_BYTES = 163840;

function copyTree(name: string): void {
  const source = join(repoRoot, name);
  if (!existsSync(source)) return;
  cpSync(source, join(outDir, name), { recursive: true });
}

function main(): void {
  mkdirSync(outDir, { recursive: true });
  copyTree("app");
  copyTree("screenshots");
  const dossier = buildDossier(repoRoot, { text_max_bytes: TEXT_MAX_BYTES });
  writeFileSync(join(outDir, "dossier.json"), dossier);
}

main();
