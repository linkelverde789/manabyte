import type { BaseCardInformation } from "#/lib/types";

export interface DeckCard extends BaseCardInformation {
  zone: string;
}

export interface CreateDeckCardData {
  scryfall_id: string;
  quantity: number;
  zone?: string;
}
