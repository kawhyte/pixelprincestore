# Private Art Files

This folder contains the high-resolution digital art files that are served through the `/api/claim-art` endpoint.

## Important Notes

- Files in this folder are **NOT publicly accessible** via the web
- They can only be downloaded through the secure API route
- Each user can only download **one** file (tracked via cookies)

## For Development

The `placeholder-art.png` file is a temporary placeholder for testing.

## For Production

Replace `placeholder-art.png` with actual high-resolution PNG files:

1. Add your art files to this folder
2. Update the `privateFileName` field in `config/free-art.ts` to match your file names
3. Ensure file names match exactly (case-sensitive)
4. Recommended format: PNG (3000x3000px or larger)

Example:
```
private/
├── ethereal-dreams.png
├── neon-cityscape.png
├── cosmic-harmony.png
└── digital-flora.png
```
