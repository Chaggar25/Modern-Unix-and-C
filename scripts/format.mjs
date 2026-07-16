#!/usr/bin/env node
// Lightweight no-dependency formatting gate. It checks for trailing whitespace and missing final newlines.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const check = process.argv.includes("--check");
const roots = ["bin", "lib", "scripts", "test", "docs"];
const names = ["README.md", "AGENTS.md", "package.json"];
const exts = new Set([".mjs", ".md", ".json"]);
let changed = false;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if ([...exts].some((ext) => path.endsWith(ext))) names.push(path);
  }
}
for (const root of roots) walk(root);

for (const file of [...new Set(names)]) {
  const before = readFileSync(file, "utf8");
  let after = before.replace(/[ \t]+$/gm, "");
  if (!after.endsWith("\n")) after += "\n";
  if (after !== before) {
    changed = true;
    if (!check) writeFileSync(file, after);
    console.log(`${check ? "Would format" : "Formatted"} ${file}`);
  }
}

if (check && changed) process.exit(1);
console.log(check ? "Format check passed." : "Format complete.");
