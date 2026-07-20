import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "config", "lib"];
const SKIP_DIRS = new Set(["studio", "node_modules"]);
const EXTS = new Set([".ts", ".tsx", ".json"]);
const ALLOWLIST: string[] = []; // repo-relative paths, keep empty

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(p, out);
    } else if (EXTS.has(p.slice(p.lastIndexOf(".")))) {
      out.push(p);
    }
  }
  return out;
}

describe("no em dashes in site code (design rule zero)", () => {
  it("finds zero em dash characters", () => {
    const offenders: string[] = [];
    for (const root of ROOTS) {
      for (const file of walk(root)) {
        if (ALLOWLIST.includes(file)) continue;
        const text = readFileSync(file, "utf8");
        const idx = text.indexOf("—");
        if (idx !== -1) {
          const line = text.slice(0, idx).split("\n").length;
          offenders.push(`${file}:${line}`);
        }
      }
    }
    expect(offenders, `Em dash found in: ${offenders.join(", ")}`).toEqual([]);
  });
});
