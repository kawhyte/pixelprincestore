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
    artist: "The Pixel Prince",
    description: "A mesmerizing blend of abstract forms and vibrant colors that evoke a sense of wonder and tranquility.",
    previewImage: "https://placehold.co/600x800/b5c9a5/2a2a2a/png?text=Ethereal+Dreams",
    privateFileName: "placeholder-art.png",
    tags: ["Abstract", "Digital", "Nature"],
    dimensions: "3000 × 4000 px",
    fileSize: "2.4 MB"
  },
  {
    id: "art_2",
    title: "Vintage Map Collection",
    artist: "The Pixel Prince",
    description: "A beautifully rendered vintage world map with warm earth tones and intricate cartographic details.",
    previewImage: "https://placehold.co/600x800/d4bfae/2a2a2a/png?text=Vintage+Map",
    privateFileName: "placeholder-art.png",
    tags: ["Maps", "Vintage", "Classic"],
    dimensions: "4000 × 5334 px",
    fileSize: "3.1 MB"
  },
  {
    id: "art_3",
    title: "Zen Garden",
    artist: "The Pixel Prince",
    description: "An exploration of minimalism and tranquility, featuring organic forms in perfect harmony.",
    previewImage: "https://placehold.co/600x800/cbbfdd/2a2a2a/png?text=Zen+Garden",
    privateFileName: "placeholder-art.png",
    tags: ["Minimalist", "Zen", "Abstract"],
    dimensions: "3000 × 4000 px",
    fileSize: "2.8 MB"
  },
  {
    id: "art_4",
    title: "Botanical Study",
    artist: "The Pixel Prince",
    description: "Nature reimagined through digital art, where organic forms meet geometric precision.",
    previewImage: "https://placehold.co/600x800/b5c9a5/2a2a2a/png?text=Botanical+Study",
    privateFileName: "placeholder-art.png",
    tags: ["Nature", "Botanical", "Modern"],
    dimensions: "3000 × 4000 px",
    fileSize: "2.2 MB"
  }
];

export const DOWNLOAD_COOKIE_NAME = "pp_download_claimed";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds
