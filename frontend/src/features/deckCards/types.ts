import type { DataCard } from "../collection/types";

export interface DeckCard extends DataCard {
  zone: string;
}

export interface CreateDeckCardData {
  scryfall_id: string;
  quantity: number;
  zone?: string;
}
