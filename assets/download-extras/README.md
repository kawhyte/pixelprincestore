# Download extras

Every file in this folder is bundled into **every** download ZIP the site
generates (alongside the artwork PNG). This is the single place to manage the
"stuff that ships with every print."

Current contents:

- `LICENSE.txt` — personal-use license (source of truth: `config/license.ts` for the on-site blurb)
- `how-to-print.pdf` — the printing guide customers get with every download

## Updating

To change what customers receive, just **replace the file here** (keep the same
filename) and commit. No code changes, no per-artwork step, no redeploy of
Sanity. The next download picks it up automatically.

To **add** a new extra (e.g. a second guide), drop the file in this folder. The
ZIP builder (`lib/build-download-zip.ts`, PLAN-12) reads this directory, so new
files are included automatically with no code change.

> Do NOT put these files in `public/` — that would make them directly
> scrapeable and bypass the ZIP pipeline.
