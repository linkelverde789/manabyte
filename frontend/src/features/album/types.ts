import type { Face } from "#/lib/types";

export interface AlbumCard {
  external_id: string;
  oracle_id: string;
  name: string;
  collector_number: string;
  card_faces: Face[];
  quantity: number;
  foil: boolean;
  condition: string;
}
