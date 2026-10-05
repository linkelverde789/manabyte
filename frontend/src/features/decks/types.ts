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
