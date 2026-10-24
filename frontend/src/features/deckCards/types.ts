import type { BaseCardInformation } from "#/lib/types";

export interface DeckCard extends BaseCardInformation {
  zone: string;
}
export interface BaseCreateCardData {
  scryfall_id: string;
  quantity: number;
}

export interface CreateDeckCardData extends BaseCreateCardData {
  zone?: string;
}

export interface PartialUpdateDeckCardData {
  quantity?: number;
  scryfall_id?: string;
}
