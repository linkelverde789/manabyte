import type { Card } from "#/lib/types";

export interface AlbumCard extends Card {
  quantity: number;
  foil: boolean;
  condition: string;
}
