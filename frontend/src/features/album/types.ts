export interface AlbumCard {
  external_id: string;
  oracle_id: string;
  name: string;
  collector_number: string;
  card_faces: CardFace[];
  quantity: number;
  foil: boolean;
  condition: string;
}

export interface CardFace {
  face_index: number;
  name: string;
  mana_cost: string;
  type_line: string;
  oracle_text: string;
  image_url: string;
  colors: string[];
}
