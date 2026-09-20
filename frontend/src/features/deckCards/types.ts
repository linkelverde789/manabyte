export interface DeckCard {
  id: number;
  scryfall_id: string;
  quantity: number;
  zone: string;
}

export interface CreateDeckCardData {
  scryfall_id: string;
  quantity: number;
  zone?: string;
}
