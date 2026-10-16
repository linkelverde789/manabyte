export interface Card {
  external_id: string;
  oracle_id: string;
  name: string;
  collector_number: string;
  lang: string;
  can_nonfoil: boolean;
  can_foil: boolean;
  price_nonfoil: number;
  price_foil: number;
  layout: string;
  rarity: string;
  keywords: string[];
  set: Set;
  card_faces: Face[];
}

export interface Face {
  face_index: number;
  name: string;
  mana_cost: string;
  type_line: string;
  oracle_text: string;
  flavor_text: string;
  image_url: string;
  colors: string[];
}

export interface Set {
  external_id: string;
  name: string;
  code: string;
  card_count: number;
  icon_url: string;
}

export interface BaseCardInformation {
  id: number;
  quantity: number;
  card: Card;
}
