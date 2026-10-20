import type { Folder } from "../folders/types";

export interface Deck {
  id: number;
  name: string;
  format: string;
  card_count: string;
  folder: Folder | null;
}

export interface CreateDeckData {
  name: string;
  format: string;
}
export const DECK_FORMATS = [
  "Standard",
  "Pioneer",
  "Modern",
  "Legacy",
  "Vintage",
  "Commander",
  "Oathbreaker",
  "Alchemy",
  "Historic",
  "Brawl",
  "Comp. Brawl",
  "Timeless",
  "Pauper",
  "Penny",
] as const;

export const ZONE_FORMAT = ["mainboard", "sideboard", "commander"] as const;
export type ZoneFormat = (typeof ZONE_FORMAT)[number];

export type DeckFormat = (typeof DECK_FORMATS)[number];
