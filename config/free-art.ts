/**
 * Free Art Collection Configuration
 *
 * This file defines the available free digital art pieces.
 * Users can download up to 3 sizes per week (resets every 7 days).
 */

export interface ArtSize {
  id: string;
  label: string;
  dimensions: string;
  fileName: string;
  fileSize: string;
  recommendedFor?: string;
}

export interface FreeArt {
  id: string;
  title: string;
  artist: string;
  description: string;
  longDescription?: string;
  previewImage: string;        // For card view (600x800)
  detailImage?: string;         // For detail page (1200x1600)
  sizes: ArtSize[];
  allSizesZip: string;         // ZIP file with all sizes
  tags: string[];
  category?: string;
}

export const freeArtCollection: FreeArt[] = [
  {
    id: "moon",
    title: "Moon Dreams",
    artist: "The Pixel Prince",
    description: "A mesmerizing blend of abstract forms and vibrant colors that evoke a sense of wonder and tranquility.",
    longDescription: "Ethereal Dreams captures the essence of nature's beauty through abstract digital art. The flowing forms and vibrant color palette create a sense of movement and energy, perfect for bringing life to any space. This piece works beautifully in modern homes, offices, or creative spaces.",
    previewImage: "/art-previews/card/moon-card.webp",
    detailImage: "/art-previews/detail/moon-detail.webp",
    allSizesZip: "moon.zip",
    tags: ["Abstract", "Digital", "Nature"],
    category: "Abstract",
    sizes: [
      {
        id: "4x5",
        label: "4\" × 5\"",
        dimensions: "1200 × 1500 px",
        fileName: "moon-4x5.png",
        fileSize: "1.2 MB",
        recommendedFor: "Small frames, desk display"
      },
      {
        id: "8x10",
        label: "8\" × 10\"",
        dimensions: "2400 × 3000 px",
        fileName: "moon-8x10.png",
        fileSize: "2.8 MB",
        recommendedFor: "Medium frames, home decor"
      },
      {
        id: "16x20",
        label: "16\" × 20\"",
        dimensions: "4800 × 6000 px",
        fileName: "moon-16x20.png",
        fileSize: "8.5 MB",
        recommendedFor: "Large frames, statement pieces"
      },
      {
        id: "40x50cm",
        label: "40 × 50 cm",
        dimensions: "4724 × 5906 px",
        fileName: "moon-40x50cm.png",
        fileSize: "8.2 MB",
        recommendedFor: "Gallery-quality, professional display"
      }
    ]
  },
  {
    id: "world-map-black-and-white",
    title: "Vintage Map Collection",
    artist: "The Pixel Prince",
    description: "A beautifully rendered vintage world map with warm earth tones and intricate cartographic details.",
    longDescription: "Step back in time with this exquisitely detailed vintage map. Featuring warm earth tones and classic cartographic styling, this piece adds a touch of worldly sophistication to any room. Perfect for travel enthusiasts, history buffs, and those who appreciate timeless design.",
    previewImage: "/art-previews/card/vintage-map.webp",
    detailImage: "/art-previews/detail/vintage-map.webp",
    allSizesZip: "vintage-map-all.zip",
    tags: ["Maps", "Vintage", "Classic"],
    category: "Maps",
    sizes: [
      {
        id: "4x5",
        label: "4\" × 5\"",
        dimensions: "1200 × 1500 px",
        fileName: "vintage-map-4x5.png",
        fileSize: "1.4 MB",
        recommendedFor: "Small frames, desk display"
      },
      {
        id: "8x10",
        label: "8\" × 10\"",
        dimensions: "2400 × 3000 px",
        fileName: "vintage-map-8x10.png",
        fileSize: "3.2 MB",
        recommendedFor: "Medium frames, home decor"
      },
      {
        id: "16x20",
        label: "16\" × 20\"",
        dimensions: "4800 × 6000 px",
        fileName: "vintage-map-16x20.png",
        fileSize: "9.1 MB",
        recommendedFor: "Large frames, statement pieces"
      },
      {
        id: "40x50cm",
        label: "40 × 50 cm",
        dimensions: "4724 × 5906 px",
        fileName: "vintage-map-40x50cm.png",
        fileSize: "8.9 MB",
        recommendedFor: "Gallery-quality, professional display"
      }
    ]
  },
  {
    id: "art_3",
    title: "Zen Garden",
    artist: "The Pixel Prince",
    description: "An exploration of minimalism and tranquility, featuring organic forms in perfect harmony.",
    longDescription: "Find peace in simplicity with Zen Garden. This minimalist composition explores the balance between form and negative space, creating a sense of calm and contemplation. Ideal for meditation spaces, bedrooms, or any environment where tranquility is valued.",
    previewImage: "/art-previews/card/zen-garden.webp",
    detailImage: "/art-previews/detail/zen-garden.webp",
    allSizesZip: "zen-garden-all.zip",
    tags: ["Minimalist", "Zen", "Abstract"],
    category: "Abstract",
    sizes: [
      {
        id: "4x5",
        label: "4\" × 5\"",
        dimensions: "1200 × 1500 px",
        fileName: "zen-garden-4x5.png",
        fileSize: "1.1 MB",
        recommendedFor: "Small frames, desk display"
      },
      {
        id: "8x10",
        label: "8\" × 10\"",
        dimensions: "2400 × 3000 px",
        fileName: "zen-garden-8x10.png",
        fileSize: "2.6 MB",
        recommendedFor: "Medium frames, home decor"
      },
      {
        id: "16x20",
        label: "16\" × 20\"",
        dimensions: "4800 × 6000 px",
        fileName: "zen-garden-16x20.png",
        fileSize: "7.8 MB",
        recommendedFor: "Large frames, statement pieces"
      },
      {
        id: "40x50cm",
        label: "40 × 50 cm",
        dimensions: "4724 × 5906 px",
        fileName: "zen-garden-40x50cm.png",
        fileSize: "7.5 MB",
        recommendedFor: "Gallery-quality, professional display"
      }
    ]
  },
  {
    id: "art_4",
    title: "Botanical Study",
    artist: "The Pixel Prince",
    description: "Nature reimagined through digital art, where organic forms meet geometric precision.",
    longDescription: "Botanical Study bridges the gap between the natural world and digital design. This piece celebrates the intricate beauty of plant life through a modern lens, combining organic shapes with clean lines. Perfect for nature lovers and contemporary design enthusiasts alike.",
    previewImage: "/art-previews/card/botanical-study.webp",
    detailImage: "/art-previews/detail/botanical-study.webp",
    allSizesZip: "botanical-study-all.zip",
    tags: ["Nature", "Botanical", "Modern"],
    category: "Nature",
    sizes: [
      {
        id: "4x5",
        label: "4\" × 5\"",
        dimensions: "1200 × 1500 px",
        fileName: "botanical-study-4x5.png",
        fileSize: "1.0 MB",
        recommendedFor: "Small frames, desk display"
      },
      {
        id: "8x10",
        label: "8\" × 10\"",
        dimensions: "2400 × 3000 px",
        fileName: "botanical-study-8x10.png",
        fileSize: "2.4 MB",
        recommendedFor: "Medium frames, home decor"
      },
      {
        id: "16x20",
        label: "16\" × 20\"",
        dimensions: "4800 × 6000 px",
        fileName: "botanical-study-16x20.png",
        fileSize: "7.2 MB",
        recommendedFor: "Large frames, statement pieces"
      },
      {
        id: "40x50cm",
        label: "40 × 50 cm",
        dimensions: "4724 × 5906 px",
        fileName: "botanical-study-40x50cm.png",
        fileSize: "7.0 MB",
        recommendedFor: "Gallery-quality, professional display"
      }
    ]
  }
];

// Download tracking configuration
export const DOWNLOAD_COOKIE_NAME = "pp_downloads";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
export const WEEKLY_DOWNLOAD_LIMIT = 3; // Maximum downloads per week
export const DOWNLOADS_PER_WEEK = 3; // User-facing constant
