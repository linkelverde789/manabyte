export interface UpdateCardData {
  scryfall_id?: string;
  quantity?: number;
}

export interface UpdateDeckCard extends UpdateCardData {
  zone?: string;
}

export interface UpdateCollectionCard extends UpdateCardData {
  foil?: boolean;
  condition?: string;
  language?: string;
  folder?: number;
}

export interface ParsedLine {
  raw: string;
  quantity: number;
  name: string;
  set?: string;
  collectorNumber?: string;
  foil?: boolean;
}
