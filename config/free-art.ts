/**
 * Free Art Collection Configuration
 *
 * This file defines the available free digital art pieces.
 * Users can claim ONE piece for free, tracked via cookies.
 */

export interface FreeArt {
  id: string;
  title: string;
  artist: string;
  description: string;
  previewImage: string;
  privateFileName: string;
  tags: string[];
  dimensions: string;
  fileSize: string;
}

export const freeArtCollection: FreeArt[] = [
  {
    id: "art_1",
    title: "Ethereal Dreams",
    artist: "PixelPrince",
    description: "A mesmerizing blend of abstract forms and vibrant colors that evoke a sense of wonder and tranquility.",
    previewImage: "https://placehold.co/600x600/1e1e1e/8b5cf6/png?text=Ethereal+Dreams",
    privateFileName: "placeholder-art.png",
    tags: ["Abstract", "Digital", "Vibrant"],
    dimensions: "3000 × 3000 px",
    fileSize: "2.4 MB"
  },
  {
    id: "art_2",
    title: "Neon Cityscape",
    artist: "PixelPrince",
    description: "A futuristic urban landscape bathed in neon lights, capturing the energy of a city that never sleeps.",
    previewImage: "https://placehold.co/600x600/1e1e1e/06b6d4/png?text=Neon+Cityscape",
    privateFileName: "placeholder-art.png",
    tags: ["Cyberpunk", "Urban", "Neon"],
    dimensions: "4000 × 2250 px",
    fileSize: "3.1 MB"
  },
  {
    id: "art_3",
    title: "Cosmic Harmony",
    artist: "PixelPrince",
    description: "An exploration of space and time, featuring swirling galaxies and celestial bodies in perfect balance.",
    previewImage: "https://placehold.co/600x600/1e1e1e/ec4899/png?text=Cosmic+Harmony",
    privateFileName: "placeholder-art.png",
    tags: ["Space", "Cosmic", "Abstract"],
    dimensions: "3600 × 3600 px",
    fileSize: "2.8 MB"
  },
  {
    id: "art_4",
    title: "Digital Flora",
    artist: "PixelPrince",
    description: "Nature reimagined through digital art, where organic forms meet geometric precision.",
    previewImage: "https://placehold.co/600x600/1e1e1e/10b981/png?text=Digital+Flora",
    privateFileName: "placeholder-art.png",
    tags: ["Nature", "Geometric", "Modern"],
    dimensions: "2400 × 3000 px",
    fileSize: "2.2 MB"
  }
];

export const DOWNLOAD_COOKIE_NAME = "pp_download_claimed";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds
