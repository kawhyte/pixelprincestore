export interface CollectionDef {
  slug: string;
  title: string; // H1 + meta title base
  metaDescription: string; // ≤155 chars
  intro: string[]; // paragraphs, 300–500 words total, keyword-targeted
  matchTags: string[]; // product matches if any tag or category (lowercased) includes one of these
  faq: { q: string; a: string }[]; // 3–5 entries
  etsyCampaign: string; // utm_campaign value
}

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: "game-room-wall-art",
    title: "Game Room Wall Art",
    metaDescription:
      "Free printable game room wall art plus printed retro gaming posters. Download, print, and level up your setup.",
    intro: [
      "A good game room deserves art that actually looks like it belongs there — not a generic movie poster stretched to fill a wall. That's the gap these prints fill: pieces built around 8-bit era palettes, arcade cabinet silhouettes, and controller iconography that reads as gaming without leaning on any single franchise's trademarks.",
      "Sizing depends on where the piece is going. A single accent print over a desk or shelf works best at 8x10 or 11x14 — close enough to read the detail without overwhelming a small wall. Above a couch or behind a TV setup, 16x20 or larger holds its own from across the room. If you're building a gallery wall, mix two or three sizes rather than framing everything identically; it reads less like a matched set from a store and more like a collection.",
      "Every piece below is free to download in every available size — no email required to preview, just to get the file sent to your inbox. Print at home on matte or semi-gloss cardstock for a cleaner finish than plain printer paper, or export the file to a local print shop if you want something sturdier. Framing in black or dark wood tends to hold up best against these designs; it keeps the retro palette from getting washed out by a lighter frame.",
      "If you want something with more weight — canvas, larger formats, or a piece that isn't in the free library yet — the shop link on each card leads to printed versions built for exactly this kind of room.",
    ],
    matchTags: ["gaming", "game", "arcade", "retro"],
    faq: [
      {
        q: "How do I print wall art at home?",
        a: "Use the highest-resolution file available for your size (each download page lists the exact pixel dimensions) and print on 200gsm+ matte or semi-gloss cardstock — regular printer paper will look thin and show through in a frame. Set your printer to \"best\" or \"photo\" quality and disable any automatic scaling so the print matches the file's aspect ratio exactly. For anything larger than 11x14, a local print shop (Staples, Walgreens, or a local shop) will get a sharper result than a home inkjet.",
      },
      {
        q: "What size wall art fits a game room?",
        a: "For a single accent piece over a desk, shelf, or small wall gap, 8x10 or 11x14 keeps detail readable up close. Above a couch, sectional, or behind a TV setup, go with 16x20 or larger so the piece holds visual weight from across the room. If you're unsure, measure the wall space and aim for the art to fill roughly 60-75% of it — too small and it disappears, too large and it crowds the space.",
      },
      {
        q: "Is the free game room art really free?",
        a: "Yes — every size of every piece in this collection is free to download for personal use. You'll be asked for an email address so the file can be sent directly (this also keeps the download link from getting abused), and you'll get one email a month about new free prints. No purchase, no trial, no catch.",
      },
    ],
    etsyCampaign: "collection-game-room",
  },
  {
    slug: "retro-gaming-prints",
    title: "Retro Gaming Prints",
    metaDescription:
      "Free retro gaming prints inspired by 8-bit and 16-bit console classics. Downloadable art plus printed posters on Etsy.",
    intro: [
      "Retro gaming art works because it's instantly legible — pixel grids, pull-down palettes, and blocky sprite shapes trigger recognition even without a single logo in sight. This collection is built entirely around that visual language: 8-bit and 16-bit era color schemes, pixel-art landscapes, and controller/cartridge motifs, all designed to avoid any single console or franchise's trademarks while still reading unmistakably as \"retro console classics.\"",
      "These prints tend to work best in pairs or small sets rather than alone — a pixel landscape next to a controller icon, or two palette-matched pieces flanking a shelf, reads more intentional than one print floating on a big wall. If you're framing a set, keep the mat and frame color consistent across all of them even if the print sizes differ; it ties a mismatched gallery wall together.",
      "Download any size for free — the file sizes are listed on each piece's page so you know exactly what you're printing before you commit paper to it. If a piece doesn't have every size listed as \"available\" yet, that size is on the way; the ones marked available are ready to send to your inbox immediately.",
      "For collectors who want the retro look outside of what's free — larger canvas prints, framed sets, or bundles — the shop link on each card jumps straight to retro-gaming-tagged pieces in the print shop.",
    ],
    matchTags: ["retro", "gaming", "pixel"],
    faq: [
      {
        q: "What makes art 'retro gaming' style?",
        a: "It's mostly about the color palette and the shapes: limited color counts (think 8 or 16 colors instead of full photographic range), blocky pixel-grid edges instead of smooth curves, and iconography drawn from consoles, cartridges, and arcade cabinets rather than any specific game's branding. That combination reads as nostalgic without needing a recognizable logo.",
      },
      {
        q: "Can I print these in black and white?",
        a: "You can, but most of these pieces are designed around their color palette as the main visual hook, so a black-and-white print will lose a lot of what makes them work. If you want a more muted look, look for pieces tagged \"minimalist\" instead — those are built to hold up in limited color.",
      },
      {
        q: "How often do new retro prints get added?",
        a: "Roughly monthly. The email signup below sends one email a month with whatever's new — that's the fastest way to know when a new piece lands in this collection instead of checking back manually.",
      },
    ],
    etsyCampaign: "collection-retro-gaming",
  },
  {
    slug: "map-prints",
    title: "Map Prints",
    metaDescription:
      "Free printable map art — city maps, world maps, and travel-style posters to download and print at home.",
    intro: [
      "Map art has stayed popular for a simple reason: it's personal without being a photograph, and it works in almost any room — an entryway, home office, or above a console table all take a map print well. This collection covers city maps, world maps, and travel-poster-style layouts, built with clean linework and a muted palette so they sit quietly in a room instead of competing with everything else on the wall.",
      "A single large map (16x20 or bigger) works as a standalone statement piece, especially in an entryway or office where there's one clear focal wall. Smaller formats (8x10, 11x14) work better as part of a set — pair a city map with a world map, or a few different cities if you're building a \"places we've been\" wall. Keep the frame style consistent across a set; mismatched frames are the fastest way to make a map wall look unplanned.",
      "Because these designs lean on fine linework, print quality matters more here than on bolder pieces — a home inkjet on cardstock will hold up fine at smaller sizes, but for 16x20 and up, a print shop will keep the thin lines from breaking up or looking soft.",
      "Every map below is free to download in every size that's marked available. If you want a specific city that isn't in the free library, or want a printed/framed version, the shop link on each card leads to the map-tagged section of the print shop.",
    ],
    matchTags: ["map", "maps", "city", "world"],
    faq: [
      {
        q: "Can I get a map of my specific city?",
        a: "Only if it's already in this collection — the free library covers a rotating set of cities and world maps rather than custom requests. If your city isn't here, the shop link on each card leads to the full map section of the print shop, which has a wider range than the free downloads.",
      },
      {
        q: "What paper is best for map prints?",
        a: "A smooth matte or semi-matte cardstock (around 200-250gsm) holds fine linework better than glossy paper, which can create glare that washes out thin details. For sizes above 11x14, print through a shop rather than a home inkjet — the finer the lines, the more resolution and print quality matters.",
      },
      {
        q: "Are these maps geographically accurate?",
        a: "They're stylized rather than survey-accurate — streets, borders, and landmarks are simplified for a clean poster look, not for navigation. If you need an accurate reference map, these aren't the right source; they're meant to be decorative.",
      },
    ],
    etsyCampaign: "collection-map-prints",
  },
  {
    slug: "printable-wall-art",
    title: "Printable Wall Art",
    metaDescription:
      "Free printable wall art you can download and print at home today — no shipping, no waiting, just a file and a printer.",
    intro: [
      "Every free piece in the library lives here — this is the full catalog rather than a themed slice of it, for anyone who wants to browse everything printable in one place instead of hunting through category pages. Retro gaming, maps, minimalist pieces, quotes, botanical prints — whatever's currently free to download shows up in this grid.",
      "\"Printable\" just means the file is designed to hold up at print resolution, not just look fine on a screen. Each piece lists its exact pixel dimensions and file size per available size, so you know before downloading whether it'll print cleanly at the size you want. As a rule of thumb: the bigger the print, the more it benefits from an actual print shop rather than a home inkjet, since fine detail and color accuracy both improve with proper print equipment.",
      "There's no cost and no catch — provide an email address so the file can be sent directly (this also caps abuse of the download system), and get one monthly email when something new is added. Nothing here requires a purchase to unlock.",
      "If you're looking for something specific — a theme, a size, a particular room — the three other collections (game room, retro gaming, and maps) are narrower slices of this same catalog built around those searches specifically.",
    ],
    matchTags: [],
    faq: [
      {
        q: "Do I need to pay for anything here?",
        a: "No. Every piece and every size marked \"available\" in this catalog is free to download for personal use — the only thing asked for is an email address to send the file to, which also helps prevent the download system from being abused.",
      },
      {
        q: "What's the difference between the free downloads and the Etsy shop?",
        a: "The free downloads are personal-use digital files you print yourself. The Etsy shop sells already-printed, framed, or canvas versions for people who'd rather not print anything themselves — plus some designs and formats that aren't part of the free catalog at all.",
      },
      {
        q: "How do I know what size to print?",
        a: "Each piece lists its available sizes with pixel dimensions and file size. As a general guide: 8x10/11x14 for a small accent space (desk, shelf, small wall gap), 16x20+ for a focal wall or above furniture. If in doubt, measure the wall space first — a print should fill roughly 60-75% of the space it's meant for.",
      },
    ],
    etsyCampaign: "collection-printable-wall-art",
  },
];

export function getCollection(slug: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function matchProductsToCollection<T extends { tags?: string[]; category?: string }>(
  products: T[],
  collection: CollectionDef
): T[] {
  const matchTags = collection.matchTags.map((t) => t.toLowerCase());
  if (matchTags.length === 0) return products;
  return products.filter((art) => {
    const haystack = [...(art.tags || []), art.category || ""].map((t) => t.toLowerCase());
    return matchTags.some((tag) => haystack.some((h) => h.includes(tag)));
  });
}
