import type { Card } from "#/lib/types";
import type { ScryfallCard } from "../scryfall/types";

export interface ImportData {
  cards: Card[];
  extra: {
    foil: boolean;
    quantity: number;
  };
  warning?: string;
}

export interface ResolvedRow {
  quantity: number;
  foil?: boolean;
  scryfall_id: string;
}

export interface ResolvedRowScryfall extends ResolvedRow {
  card: ScryfallCard;
}
