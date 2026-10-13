export interface Card {
  oracle_id: string;
  external_id: string;
  name: string;
  set: Set;
  collector_number: string;
  lang: string;
  can_nonfoil: boolean;
  can_foil: boolean;
  price_nonfoil: number;
  price_foil: number;
  layout: string;
  keywords: string[];
  card_faces: Face[];
}

export interface BaseCardInformation {
  id: number;
  quantity: number;
  card: Card;
}

export interface Set {
  external_id: string;
  name: string;
  code: string;
  card_count: number;
  icon_url: string;
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
